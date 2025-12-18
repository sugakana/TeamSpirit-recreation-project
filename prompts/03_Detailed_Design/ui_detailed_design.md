@ui_detailed_design_rules.mdc を参考に、
@feature-list.md のF02020201、UWPの顔認証画面の詳細設計書を作成してください。
利用想定のAPIは以下となります。
@顔認証処理（未作成）
@脈拍測定処理（未作成）
FigmaMCPを利用して以下サイトから画面を取得してください
・顔認証画面_初期表示：
@https://www.figma.com/design/Rtu7ns6gqY6n0QJte8du9l/%E9%A1%94%E3%83%91%E3%82%B9%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E5%A3%B2%E5%BA%97%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9_UWP%E7%94%BB%E9%9D%A2?node-id=2-7&t=v1SDvoZxYdJiP5SU-0 
・顔認証画面_成功画面：
@https://www.figma.com/design/Rtu7ns6gqY6n0QJte8du9l/%E9%A1%94%E3%83%91%E3%82%B9%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E5%A3%B2%E5%BA%97%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9_UWP%E7%94%BB%E9%9D%A2?node-id=7-14&t=v1SDvoZxYdJiP5SU-0 
・顔認証画面_失敗画面：
@https://www.figma.com/design/Rtu7ns6gqY6n0QJte8du9l/%E9%A1%94%E3%83%91%E3%82%B9%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E5%A3%B2%E5%BA%97%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9_UWP%E7%94%BB%E9%9D%A2?node-id=2-17&t=v1SDvoZxYdJiP5SU-0 
本画面は、顔認証及び脈拍測定を行う画面である。顔認証と脈拍測定の両方が成功した場合は、成功画面を表示し、商品選択ボタンが押下可能となる。どちらかが失敗した場合は、失敗画面を表示し、エラーも画面に表示する。また、顔認証により、ユーザーを特定した後、脈拍測定を行う。キャンセルボタンは商品購入開始画面に戻るためのボタンである。