const fs = require('fs');
const path = require('path');

/**
 * Figma JSONファイルを複数の小さなJSONファイルに分割するスクリプト
 * 
 * 使用方法:
 *   node split-figma-json.js <input-json-file> [options]
 * 
 * オプション:
 *   --max-size <bytes>     各分割ファイルの最大サイズ（デフォルト: 500KB）
 *   --max-nodes <count>    各分割ファイルの最大ノード数（デフォルト: 100）
 *   --max-depth <level>    分割する最大階層レベル（デフォルト: 3）
 *   --output-dir <dir>     出力ディレクトリ（デフォルト: <input-file>-split）
 */

// 設定
const DEFAULT_MAX_SIZE = 500 * 1024; // 500KB
const DEFAULT_MAX_NODES = 100;
const DEFAULT_MAX_DEPTH = 3;

// コマンドライン引数の解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    inputFile: null,
    maxSize: DEFAULT_MAX_SIZE,
    maxNodes: DEFAULT_MAX_NODES,
    maxDepth: DEFAULT_MAX_DEPTH,
    outputDir: null
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--max-size' && i + 1 < args.length) {
      options.maxSize = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--max-nodes' && i + 1 < args.length) {
      options.maxNodes = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--max-depth' && i + 1 < args.length) {
      options.maxDepth = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--output-dir' && i + 1 < args.length) {
      options.outputDir = args[i + 1];
      i++;
    } else if (!options.inputFile && !args[i].startsWith('--')) {
      options.inputFile = args[i];
    }
  }

  if (!options.inputFile) {
    console.error('Usage: node split-figma-json.js <input-json-file> [options]');
    console.error('Options:');
    console.error('  --max-size <bytes>     Maximum size per split file (default: 500KB)');
    console.error('  --max-nodes <count>    Maximum nodes per split file (default: 100)');
    console.error('  --max-depth <level>    Maximum depth to split (default: 3)');
    console.error('  --output-dir <dir>     Output directory (default: <input-file>-split)');
    process.exit(1);
  }

  if (!options.outputDir) {
    const inputBase = path.basename(options.inputFile, path.extname(options.inputFile));
    options.outputDir = path.join(inputBase, `${inputBase}-split`);
  }

  return options;
}

// ノードのサイズを計算（JSON文字列として）
function calculateNodeSize(node) {
  return JSON.stringify(node).length;
}

// ノード数をカウント
function countNodes(node) {
  if (!node) return 0;
  let count = 1;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

// ノードの階層レベルを取得
function getNodeDepth(node, currentDepth = 0) {
  if (!node || !Array.isArray(node.children) || node.children.length === 0) {
    return currentDepth;
  }
  let maxDepth = currentDepth;
  for (const child of node.children) {
    const childDepth = getNodeDepth(child, currentDepth + 1);
    if (childDepth > maxDepth) {
      maxDepth = childDepth;
    }
  }
  return maxDepth;
}

// ノードを分割可能かチェック
function shouldSplitNode(node, options, currentDepth = 0) {
  if (currentDepth >= options.maxDepth) {
    return false;
  }
  
  const nodeCount = countNodes(node);
  const nodeSize = calculateNodeSize(node);
  
  return nodeCount > options.maxNodes || nodeSize > options.maxSize;
}

// ノードを分割（再帰的）
function splitNode(node, options, currentDepth = 0, splitIndex = { value: 0 }, baseName = 'part', splitFiles = []) {
  if (!node) return null;

  const nodeSize = calculateNodeSize(node);
  const nodeCount = countNodes(node);
  
  // ルートノードが大きい場合でも、子ノードをグループ化して分割する
  const shouldForceGroupSplit = currentDepth === 0 && (nodeSize > options.maxSize || nodeCount > options.maxNodes);
  
  // 分割が必要かチェック
  if (!shouldSplitNode(node, options, currentDepth) && !shouldForceGroupSplit) {
    // 子ノードを再帰的に処理
    if (Array.isArray(node.children) && node.children.length > 0) {
      const processedChildren = [];
      let currentGroup = [];
      let currentGroupSize = 0;
      let currentGroupNodes = 0;
      
      for (const child of node.children) {
        const childSize = calculateNodeSize(child);
        const childNodes = countNodes(child);
        const processedChild = splitNode(child, options, currentDepth + 1, splitIndex, baseName, splitFiles);
        
        if (processedChild) {
          const processedSize = calculateNodeSize(processedChild);
          const processedNodes = countNodes(processedChild);
          
          // 現在のグループに追加できるかチェック
          if (currentGroup.length > 0 && 
              (currentGroupSize + processedSize > options.maxSize || 
               currentGroupNodes + processedNodes > options.maxNodes)) {
            // 現在のグループを分割ファイルとして保存
            if (currentGroup.length > 0) {
              splitIndex.value++;
              const partName = `${baseName}-${splitIndex.value}`;
              const partFileName = `${partName}.json`;
              
              const partNode = {
                type: node.type,
                name: `${node.name || 'Part'}-${splitIndex.value}`,
                children: currentGroup
              };
              
              splitFiles.push({
                fileName: partFileName,
                node: partNode
              });
              
              processedChildren.push({
                type: 'REFERENCE',
                reference: partFileName,
                originalType: node.type,
                name: partNode.name,
                metadata: {
                  nodeCount: currentGroupNodes,
                  size: currentGroupSize
                }
              });
              
              currentGroup = [];
              currentGroupSize = 0;
              currentGroupNodes = 0;
            }
          }
          
          // 処理された子ノードが大きすぎる場合は、直接分割ファイルとして保存
          if (processedSize > options.maxSize || processedNodes > options.maxNodes) {
            splitIndex.value++;
            const childPartName = `${baseName}-${splitIndex.value}`;
            const childPartFileName = `${childPartName}.json`;
            
            splitFiles.push({
              fileName: childPartFileName,
              node: processedChild
            });
            
            processedChildren.push({
              type: 'REFERENCE',
              reference: childPartFileName,
              originalType: processedChild.type,
              name: processedChild.name || 'Unknown',
              metadata: {
                width: processedChild.width,
                height: processedChild.height,
                x: processedChild.x,
                y: processedChild.y,
                nodeCount: processedNodes,
                size: processedSize
              }
            });
          } else {
            // グループに追加
            currentGroup.push(processedChild);
            currentGroupSize += processedSize;
            currentGroupNodes += processedNodes;
          }
        }
      }
      
      // 残りのグループを処理
      if (currentGroup.length > 0) {
        if (currentGroupSize > options.maxSize || currentGroupNodes > options.maxNodes) {
          // グループが大きすぎる場合は分割
          splitIndex.value++;
          const partName = `${baseName}-${splitIndex.value}`;
          const partFileName = `${partName}.json`;
          
          const partNode = {
            type: node.type,
            name: `${node.name || 'Part'}-${splitIndex.value}`,
            children: currentGroup
          };
          
          splitFiles.push({
            fileName: partFileName,
            node: partNode
          });
          
          processedChildren.push({
            type: 'REFERENCE',
            reference: partFileName,
            originalType: node.type,
            name: partNode.name,
            metadata: {
              nodeCount: currentGroupNodes,
              size: currentGroupSize
            }
          });
        } else {
          // グループが小さい場合はそのまま追加
          processedChildren.push(...currentGroup);
        }
      }
      
      return {
        ...node,
        children: processedChildren
      };
    }
    return node;
  }

  // 分割する場合（または強制的にグループ分割する場合）
  const result = {
    ...node,
    children: []
  };

  // 子ノードを処理
  if (Array.isArray(node.children) && node.children.length > 0) {
    // 強制的にグループ分割する場合、子ノードをグループ化して処理
    if (shouldForceGroupSplit) {
      let currentGroup = [];
      let currentGroupSize = 0;
      let currentGroupNodes = 0;
      
      for (const child of node.children) {
        const childSize = calculateNodeSize(child);
        const childNodes = countNodes(child);
        const processedChild = splitNode(child, options, currentDepth + 1, splitIndex, baseName, splitFiles);
        
        if (processedChild) {
          const processedSize = calculateNodeSize(processedChild);
          const processedNodes = countNodes(processedChild);
          
          // 現在のグループに追加できるかチェック
          if (currentGroup.length > 0 && 
              (currentGroupSize + processedSize > options.maxSize || 
               currentGroupNodes + processedNodes > options.maxNodes)) {
            // 現在のグループを分割ファイルとして保存
            splitIndex.value++;
            const partName = `${baseName}-${splitIndex.value}`;
            const partFileName = `${partName}.json`;
            
            const partNode = {
              type: node.type,
              name: `${node.name || 'Part'}-${splitIndex.value}`,
              children: currentGroup
            };
            
            splitFiles.push({
              fileName: partFileName,
              node: partNode
            });
            
            result.children.push({
              type: 'REFERENCE',
              reference: partFileName,
              originalType: node.type,
              name: partNode.name,
              metadata: {
                nodeCount: currentGroupNodes,
                size: currentGroupSize
              }
            });
            
            currentGroup = [];
            currentGroupSize = 0;
            currentGroupNodes = 0;
          }
          
          // 処理された子ノードが大きすぎる場合は、直接分割ファイルとして保存
          if (processedSize > options.maxSize || processedNodes > options.maxNodes) {
            splitIndex.value++;
            const childPartName = `${baseName}-${splitIndex.value}`;
            const childPartFileName = `${childPartName}.json`;
            
            splitFiles.push({
              fileName: childPartFileName,
              node: processedChild
            });
            
            result.children.push({
              type: 'REFERENCE',
              reference: childPartFileName,
              originalType: processedChild.type,
              name: processedChild.name || 'Unknown',
              metadata: {
                width: processedChild.width,
                height: processedChild.height,
                x: processedChild.x,
                y: processedChild.y,
                nodeCount: processedNodes,
                size: processedSize
              }
            });
          } else {
            // グループに追加
            currentGroup.push(processedChild);
            currentGroupSize += processedSize;
            currentGroupNodes += processedNodes;
          }
        }
      }
      
      // 残りのグループを処理
      if (currentGroup.length > 0) {
        if (currentGroupSize > options.maxSize || currentGroupNodes > options.maxNodes) {
          // グループが大きすぎる場合は分割
          splitIndex.value++;
          const partName = `${baseName}-${splitIndex.value}`;
          const partFileName = `${partName}.json`;
          
          const partNode = {
            type: node.type,
            name: `${node.name || 'Part'}-${splitIndex.value}`,
            children: currentGroup
          };
          
          splitFiles.push({
            fileName: partFileName,
            node: partNode
          });
          
          result.children.push({
            type: 'REFERENCE',
            reference: partFileName,
            originalType: node.type,
            name: partNode.name,
            metadata: {
              nodeCount: currentGroupNodes,
              size: currentGroupSize
            }
          });
        } else {
          // グループが小さい場合はそのまま追加
          result.children.push(...currentGroup);
        }
      }
      
      return result;
    }
    
    // 通常の分割処理
    for (const child of node.children) {
      const childSize = calculateNodeSize(child);
      const childNodes = countNodes(child);
      const shouldSplitChild = shouldSplitNode(child, options, currentDepth + 1);

      if (shouldSplitChild) {
        // 子ノードも分割が必要な場合、再帰的に処理
        const splitChild = splitNode(child, options, currentDepth + 1, splitIndex, baseName, splitFiles);
        if (splitChild) {
          // 分割された子ノードが大きすぎる場合は、さらに分割ファイルとして保存
          const splitChildSize = calculateNodeSize(splitChild);
          const splitChildNodes = countNodes(splitChild);
          
          if (splitChildSize > options.maxSize || splitChildNodes > options.maxNodes) {
            splitIndex.value++;
            const childPartName = `${baseName}-${splitIndex.value}`;
            const childPartFileName = `${childPartName}.json`;
            
            splitFiles.push({
              fileName: childPartFileName,
              node: splitChild
            });
            
            result.children.push({
              type: 'REFERENCE',
              reference: childPartFileName,
              originalType: splitChild.type,
              name: splitChild.name || 'Unknown',
              metadata: {
                width: splitChild.width,
                height: splitChild.height,
                x: splitChild.x,
                y: splitChild.y,
                nodeCount: splitChildNodes,
                size: splitChildSize
              }
            });
          } else {
            // 分割された子ノードが小さい場合はそのまま追加
            result.children.push(splitChild);
          }
        }
      } else {
        // 子ノードが大きすぎる場合は、直接分割ファイルとして保存
        if (childSize > options.maxSize || childNodes > options.maxNodes) {
          splitIndex.value++;
          const childPartName = `${baseName}-${splitIndex.value}`;
          const childPartFileName = `${childPartName}.json`;
          
          splitFiles.push({
            fileName: childPartFileName,
            node: child
          });
          
          result.children.push({
            type: 'REFERENCE',
            reference: childPartFileName,
            originalType: child.type,
            name: child.name || 'Unknown',
            metadata: {
              width: child.width,
              height: child.height,
              x: child.x,
              y: child.y,
              nodeCount: childNodes,
              size: childSize
            }
          });
        } else {
          // 子ノードをそのまま追加
          result.children.push(child);
        }
      }
    }

  }

  return result;
}

// 分割されたファイルを保存
function saveSplitFiles(mainNode, splitFiles, outputDir, baseName = 'main') {
  const files = [];
  
  // ディレクトリを作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 分割されたファイルを保存
  for (const splitFile of splitFiles) {
    const filePath = path.join(outputDir, splitFile.fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const splitNodeData = {
      type: 'SPLIT_NODE',
      version: '1.0',
      node: splitFile.node
    };
    
    fs.writeFileSync(filePath, JSON.stringify(splitNodeData, null, 2), 'utf-8');
    files.push(splitFile.fileName);
  }

  // メインファイルを保存
  const mainFile = {
    type: 'SPLIT_ROOT',
    version: '1.0',
    originalStructure: {
      type: mainNode.type,
      name: mainNode.name,
      width: mainNode.width,
      height: mainNode.height
    },
    children: mainNode.children || [],
    splitFiles: splitFiles.map(sf => sf.fileName)
  };

  const mainFilePath = path.join(outputDir, `${baseName}-root.json`);
  fs.writeFileSync(mainFilePath, JSON.stringify(mainFile, null, 2), 'utf-8');
  files.unshift(`${baseName}-root.json`);

  return files;
}

// メイン処理
function main() {
  const options = parseArgs();

  console.log('Reading input JSON file...');
  const inputPath = path.resolve(options.inputFile);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  
  console.log('Analyzing JSON structure...');
  console.log(`- Input file size: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB`);
  
  // 入力データが配列の場合、最初の要素を処理
  const rootNode = Array.isArray(inputData) ? inputData[0] : inputData;
  
  const totalNodes = countNodes(rootNode);
  const totalSize = calculateNodeSize(rootNode);
  
  console.log(`- Total nodes: ${totalNodes}`);
  console.log(`- Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`- Max depth: ${getNodeDepth(rootNode)}`);
  
  console.log('\nSplitting JSON...');
  const splitIndex = { value: 0 };
  const baseName = path.basename(options.inputFile, path.extname(options.inputFile));
  const splitFiles = [];
  const splitRoot = splitNode(rootNode, options, 0, splitIndex, baseName, splitFiles);
  
  console.log(`- Split into ${splitFiles.length} additional files`);
  
  console.log('Saving split files...');
  const outputDir = path.resolve(options.outputDir);
  const savedFiles = saveSplitFiles(splitRoot, splitFiles, outputDir, baseName);
  
  console.log(`\nSplit completed!`);
  console.log(`- Output directory: ${outputDir}`);
  console.log(`- Total files created: ${savedFiles.length}`);
  console.log(`- Files:`);
  for (const file of savedFiles) {
    const filePath = path.join(outputDir, file);
    const fileSize = fs.statSync(filePath).size;
    console.log(`  - ${file} (${(fileSize / 1024).toFixed(2)} KB)`);
  }
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { splitNode, saveSplitFiles, countNodes, calculateNodeSize };

