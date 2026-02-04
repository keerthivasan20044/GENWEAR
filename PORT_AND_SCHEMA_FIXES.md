# GENWEAR - Port Conflict & Schema Issues Fixed

## 🐛 Issues Resolved

### 1. Port Conflict Issues ✅
**Problem:**
- Multiple backend server instances were running simultaneously
- Port 5000 and 5001 were both occupied
- Error: `EADDRINUSE: address already in use`

**Solution:**
- ✅ Killed all running node processes
- ✅ Started only ONE backend instance on port 5001
- ✅ Started only ONE frontend instance on port 5173

---

### 2. Mongoose Schema Warnings ✅

#### Issue A: Reserved Keyword Warning
**Problem:**
```
Warning: `isNew` is a reserved schema pathname
```
- `isNew` is a reserved Mongoose property used internally
- Using it in schema can cause unexpected behavior

**Solution:**
- ✅ Renamed `isNew` to `isNewArrival` in Product model
- ✅ Updated all index references
- ✅ Added `suppressReservedKeysWarning: true` to schema options

**File Modified:** `/server/models/Product.js`

---

#### Issue B: Duplicate Index Warnings
**Problem:**
```
Warning: Duplicate schema index on {"slug":1}
Warning: Duplicate schema index on {"orderNumber":1}
```
- Fields with `unique: true` automatically create an index
- Additional manual `schema.index()` creates duplicate

**Solution:**
- ✅ Removed duplicate `slug` index from Product model
- ✅ Removed duplicate `orderNumber` index from Order model
- ✅ Added comments explaining why manual indexes were removed

**Files Modified:**
- `/server/models/Product.js`
- `/server/models/Order.js`

---

## ✅ Current Status

### Backend (Port 5001)
```
✅ Running successfully
✅ MongoDB connected
✅ No Mongoose warnings
✅ API endpoints active
```

### Frontend (Port 5173)
```
✅ Running successfully
✅ Vite dev server active
✅ No compilation errors
✅ Ready for development
```

---

## 📝 Changes Made

### Product.js Schema Changes:
```javascript
// BEFORE
isNew: {
    type: Boolean,
    default: false,
}

// Index declarations
productSchema.index({ isNew: 1 })
productSchema.index({ slug: 1 }) // Duplicate!

// AFTER
isNewArrival: {
    type: Boolean,
    default: false,
}

// Schema options
{
    timestamps: true,
    suppressReservedKeysWarning: true
}

// Index declarations
productSchema.index({ isNewArrival: 1 })
// slug already has unique:true, no need for separate index
```

### Order.js Schema Changes:
```javascript
// BEFORE
orderSchema.index({ orderNumber: 1 }) // Duplicate!

// AFTER
// orderNumber already has unique:true, no need for separate index
```

---

## 🚀 How to Start (Clean)

### 1. Stop All Servers
```powershell
Get-Process -Name node | Stop-Process -Force
```

### 2. Start Backend (ONE instance only)
```powershell
cd server
npm start
```
**Expected:** Server starts on port 5001, MongoDB connects, no warnings

### 3. Start Frontend (ONE instance only)
```powershell
cd client
npm run dev
```
**Expected:** Vite starts on port 5173

---

## ⚠️ Important Notes

### Avoid Multiple Instances
**DON'T:**
- Run `npm start` and `npm run dev` simultaneously in server folder
- Open multiple terminals running the same server
- Forget to kill previous instances before restarting

**DO:**
- Kill all node processes before starting: `Get-Process -Name node | Stop-Process -Force`
- Run only ONE backend instance
- Run only ONE frontend instance

### Schema Best Practices
1. **Avoid reserved keywords:** `isNew`, `save`, `validate`, `remove`, etc.
2. **Don't duplicate indexes:** If a field has `unique: true`, don't add `schema.index()`
3. **Use suppressReservedKeysWarning:** If you must use reserved keywords

---

## 🎯 Testing Checklist

- ✅ Backend responds at http://localhost:5001/api/health
- ✅ Frontend loads at http://localhost:5173
- ✅ No Mongoose warnings in console
- ✅ No port conflict errors
- ✅ Products page loads with mock data
- ✅ Filters work correctly
- ✅ No console errors

---

## 📊 Summary

### Before:
- ❌ Multiple server instances running
- ❌ Port conflicts on 5000 and 5001
- ❌ Mongoose reserved keyword warnings
- ❌ Duplicate index warnings

### After:
- ✅ Single backend instance on port 5001
- ✅ Single frontend instance on port 5173
- ✅ No Mongoose warnings
- ✅ Clean console output
- ✅ Fully functional application

---

**Status:** ✅ All issues resolved - Application ready for development!
**Date:** January 24, 2026
**Next Steps:** Access http://localhost:5173 and start developing!
