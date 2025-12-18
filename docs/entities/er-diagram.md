# TeamSpirit勤怠管理システム

## ER図

```mermaid
erDiagram

    EMPLOYEE ||--o{ ATTENDANCE_RECORD : "勤怠記録を持つ"
    EMPLOYEE ||--o{ WORK_HOURS : "工数実績を持つ"
    EMPLOYEE ||--o{ VACATION_BALANCE : "休暇残日数を持つ"
    EMPLOYEE ||--o{ VACATION_HISTORY : "休暇取得履歴を持つ"
    EMPLOYEE ||--o{ APPLICATION_HISTORY : "申請履歴を持つ"
    EMPLOYEE ||--o{ MONTHLY_ATTENDANCE : "月次勤怠を持つ"
    EMPLOYEE ||--o{ MONTHLY_APPROVAL_HISTORY : "月次承認履歴を持つ"
    
    WORK_LOCATION ||--o{ ATTENDANCE_RECORD : "勤務場所として使用される"
    
    JOB_MASTER ||--o{ WORK_HOURS : "工数入力に使用される"
    
    VACATION_TYPE ||--o{ VACATION_BALANCE : "休暇種別を分類する"
    VACATION_TYPE ||--o{ VACATION_HISTORY : "休暇種別を分類する"
    
    ATTENDANCE_RECORD ||--o{ BREAK_TIME : "休憩時間を持つ"
    ATTENDANCE_RECORD ||--o{ OFFICIAL_OUTING : "公用外出を持つ"
    ATTENDANCE_RECORD ||--o{ WORK_HOURS : "工数実績を持つ"

    EMPLOYEE {
        string EMPLOYEE_ID PK
        string EMPLOYEE_NAME
        string PASSWORD
        string EMAIL_ADDRESS
        string DEPARTMENT
        string POSITION
        date HIRE_DATE
        time STANDARD_WORK_START_TIME
        time STANDARD_WORK_END_TIME
        boolean IS_ACTIVE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    WORK_LOCATION {
        string LOCATION_CODE PK
        string LOCATION_NAME
        int DISPLAY_ORDER
        boolean IS_ACTIVE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    JOB_MASTER {
        string JOB_CODE PK
        string JOB_NAME
        string JOB_CATEGORY
        string PROJECT_CODE
        boolean IS_ACTIVE
        date START_DATE
        date END_DATE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    VACATION_TYPE {
        string VACATION_TYPE_CODE PK
        string VACATION_TYPE_NAME
        string VACATION_CATEGORY
        boolean IS_PAID
        float ANNUAL_GRANT_DAYS
        int DISPLAY_ORDER
        boolean IS_ACTIVE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    NOTIFICATION {
        int NOTIFICATION_ID PK
        string NOTIFICATION_TYPE
        string TARGET_TYPE
        string TARGET_ID
        string TITLE
        text CONTENT
        datetime DISPLAY_START_DATE
        datetime DISPLAY_END_DATE
        boolean IS_IMPORTANT
        boolean IS_ACTIVE
        string CREATED_BY
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    ATTENDANCE_RECORD {
        int ATTENDANCE_ID PK
        string EMPLOYEE_ID FK
        date WORK_DATE
        datetime CLOCK_IN_TIME
        datetime CLOCK_OUT_TIME
        string CLOCK_IN_TYPE
        string CLOCK_OUT_TYPE
        datetime ORIGINAL_CLOCK_IN_TIME
        datetime ORIGINAL_CLOCK_OUT_TIME
        string WORK_LOCATION_CODE FK
        float ACTUAL_WORK_HOURS
        float SCHEDULED_WORK_HOURS
        float OVERTIME_HOURS
        float WITHIN_LEGAL_OVERTIME_HOURS
        float OVER_LEGAL_OVERTIME_HOURS
        float NIGHT_WORK_HOURS
        float LEGAL_HOLIDAY_WORK_HOURS
        float HOLIDAY_WORK_HOURS
        boolean IS_DAILY_CONFIRMED
        datetime DAILY_CONFIRMED_AT
        boolean IS_MONTHLY_CONFIRMED
        datetime MONTHLY_CONFIRMED_AT
        string APPROVAL_STATUS
        text REMARK_TEXT
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    BREAK_TIME {
        int BREAK_ID PK
        int ATTENDANCE_ID FK
        int BREAK_SEQ
        datetime BREAK_START_TIME
        datetime BREAK_END_TIME
        int BREAK_DURATION_MINUTES
        string BREAK_TYPE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    OFFICIAL_OUTING {
        int OUTING_ID PK
        int ATTENDANCE_ID FK
        int OUTING_SEQ
        datetime OUTING_START_TIME
        datetime OUTING_END_TIME
        int OUTING_DURATION_MINUTES
        string OUTING_PURPOSE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    WORK_HOURS {
        int WORK_HOURS_ID PK
        int ATTENDANCE_ID FK
        string EMPLOYEE_ID FK
        date WORK_DATE
        string JOB_CODE FK
        string WORK_CODE
        float WORK_HOURS_VALUE
        int WORK_VOLUME
        string INPUT_TYPE
        text REMARKS
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    VACATION_BALANCE {
        int BALANCE_ID PK
        string EMPLOYEE_ID FK
        string VACATION_TYPE_CODE FK
        int FISCAL_YEAR
        float GRANTED_DAYS
        float USED_DAYS
        float REMAINING_DAYS
        date GRANT_DATE
        date EXPIRATION_DATE
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    VACATION_HISTORY {
        int VACATION_ID PK
        string EMPLOYEE_ID FK
        string VACATION_TYPE_CODE FK
        date START_DATE
        date END_DATE
        float VACATION_DAYS
        string HALF_DAY_TYPE
        text REASON
        text CONTACT_INFO
        string APPROVAL_STATUS
        string APPROVED_BY
        datetime APPROVED_AT
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    APPLICATION_HISTORY {
        int APPLICATION_ID PK
        string EMPLOYEE_ID FK
        string APPLICATION_TYPE
        date TARGET_START_DATE
        date TARGET_END_DATE
        float OVERTIME_HOURS
        text REASON
        string APPROVAL_STATUS
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    MONTHLY_ATTENDANCE {
        int MONTHLY_ATTENDANCE_ID PK
        string EMPLOYEE_ID FK
        string TARGET_YEAR_MONTH
        string MONTHLY_APPROVAL_STATUS
        datetime SUBMITTED_AT
        datetime APPROVED_AT
        string APPROVED_BY FK
        datetime CREATED_AT
        datetime UPDATED_AT
    }

    MONTHLY_APPROVAL_HISTORY {
        int HISTORY_ID PK
        string EMPLOYEE_ID FK
        string TARGET_YEAR_MONTH
        int SEQ_NO
        datetime ACTION_DATETIME
        string ACTION_TYPE
        string ACTOR_ID FK
        text COMMENT
        datetime CREATED_AT
    }

```

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|----------|--------|
| 2025-11-27 | 初版作成 | sugakana |
| 2025-12-08 | 月次勤怠（MONTHLY_ATTENDANCE）と月次承認履歴（MONTHLY_APPROVAL_HISTORY）を追加。EMPLOYEEとの関係を追加 | AI Assistant |
| 2025-12-08 | 申請履歴（APPLICATION_HISTORY）を追加。EMPLOYEEとの関係を追加 | AI Assistant |
| 2025-12-09 | ATTENDANCE_RECORDにORIGINAL_CLOCK_IN_TIME、ORIGINAL_CLOCK_OUT_TIME、WITHIN_LEGAL_OVERTIME_HOURS、OVER_LEGAL_OVERTIME_HOURS、LEGAL_HOLIDAY_WORK_HOURSを追加。VACATION_HISTORYにCONTACT_INFOを追加 | AI Assistant |

