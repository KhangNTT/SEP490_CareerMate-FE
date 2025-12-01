# CV Sync Status Modal - Real-time Preview

## 🎯 Tính năng

Modal popup hiển thị **real-time** data từ Python API khi nhấn nút **Sync** trên CV card.

## ✨ Đặc điểm

### 1. **Hiển thị ngay lập tức**
- Modal mở ngay khi nhấn Sync (không đợi parsing xong)
- Hiển thị status badge: Processing / Completed / Failed
- Cập nhật real-time khi có data mới từ API

### 2. **2 Tab xem data**
- **📄 Parsed Data**: Dữ liệu đã parse (personal_info, education, experience, skills, etc.)
- **🔧 Raw Response**: Response thô từ API (task_id, status, result)

### 3. **Quick Stats**
Hiển thị thống kê nhanh:
- Personal Info: ✓/✗
- Education: số lượng
- Experience: số lượng
- Skills: số lượng
- Certifications: số lượng

### 4. **Copy to Clipboard**
- Copy nội dung JSON đang xem (Parsed hoặc Raw)
- Hiển thị feedback "Copied!" khi thành công

### 5. **Status Badge với màu sắc**
- 🔵 **Processing**: Blue - đang xử lý (spinning loader)
- 🟢 **Completed**: Green - hoàn thành (checkmark)
- 🔴 **Failed**: Red - lỗi (X icon)

## 🔧 Cách sử dụng

### Trong CVCardHorizontal.tsx:

```typescript
const [showStatusModal, setShowStatusModal] = useState(false);
const [syncStatus, setSyncStatus] = useState<"processing" | "completed" | "failed">("processing");
const [parsedData, setParsedData] = useState<ParsedCV | null>(null);
const [rawResponse, setRawResponse] = useState<TaskStatusResponse | null>(null);
const [taskId, setTaskId] = useState<string>("");

const handleSync = async () => {
  setShowStatusModal(true); // Mở modal ngay
  
  await syncCVWithUpdates(
    cv.downloadUrl,
    cv.name,
    (update) => {
      // Real-time updates
      setTaskId(update.taskId);
      setSyncStatus(update.status);
      setParsedData(update.data);
      setRawResponse(update.rawResponse);
    }
  );
};

// Render modal
<CVSyncStatusModal 
  open={showStatusModal}
  onClose={() => setShowStatusModal(false)}
  taskId={taskId}
  status={syncStatus}
  data={parsedData}
  rawResponse={rawResponse}
/>
```

## 📊 API Response Example

### HTTP 202 - Processing
```json
{
  "task_id": "1",
  "status": "processing"
}
```

### HTTP 200 - Completed
```json
{
  "task_id": "1",
  "status": "completed",
  "result": {
    "personal_info": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "education": [...],
    "experience": [...],
    "skills": [...]
  }
}
```

## 🎨 UI Design

### Modal Layout:
```
┌─────────────────────────────────────────────┐
│ Header: Title | Task ID | Status Badge | X  │
├─────────────────────────────────────────────┤
│ Tabs: [Parsed Data] [Raw Response] | Copy   │
├─────────────────────────────────────────────┤
│                                             │
│  JSON Content (scrollable, max-h: 65vh)    │
│                                             │
│  Quick Stats (education, skills, etc.)     │
│                                             │
├─────────────────────────────────────────────┤
│ Footer: Info message | Close Button        │
└─────────────────────────────────────────────┘
```

### Colors:
- Primary: `#3a4660` (dark blue)
- Processing: Blue gradient
- Completed: Green gradient
- Failed: Red gradient
- Background: Translucent black with blur

## ⚡ Real-time Updates

Flow khi Sync:
1. **Nhấn Sync** → Modal mở với status "Processing"
2. **Upload file** → Task ID hiển thị
3. **Polling bắt đầu** → Raw Response tab cập nhật mỗi 2.5s
4. **Status = 202** → Vẫn hiển thị "Processing" với spinner
5. **Status = 200** → Parsed Data xuất hiện, status → "Completed"
6. **Quick Stats** → Hiển thị số lượng education, skills, etc.

## 🐛 Debug với Modal

Khi API trả về 202:
```
GET /api/v1/cv/task-status/1/ HTTP/1.1" 202 20
```

Modal sẽ:
- ✅ Hiển thị Task ID: "1"
- ✅ Status Badge: "Processing" (blue, spinning)
- ✅ Raw Response tab: `{ "task_id": "1", "status": "processing" }`
- ✅ Parsed Data tab: "Still processing... Please wait"
- ✅ Tiếp tục polling cho đến khi status = "completed"

## 🔑 Keyboard Shortcuts

- **ESC**: Đóng modal
- **Click outside**: Đóng modal
- **Tab switching**: Click vào tab để chuyển đổi

## 📱 Responsive Design

- Mobile: Modal full width với padding 16px
- Tablet: Max width 768px
- Desktop: Max width 1024px (5xl)
- Height: Max 65vh (scrollable content)

---

**Created**: November 27, 2025  
**Component**: `CVSyncStatusModal.tsx`  
**Purpose**: Developer tool để debug và xem data từ Python API real-time
