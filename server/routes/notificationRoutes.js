import express from 'express'
import Notification from '../models/Notification.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query
        
        const query = { userId: req.user._id }
        if (unreadOnly === 'true') query.readAt = { $exists: false }

        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const skip = (pageNum - 1) * limitNum

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip)

        const totalNotifications = await Notification.countDocuments(query)
        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            readAt: { $exists: false }
        })

        res.json({
            notifications,
            pagination: {
                page: pageNum,
                totalPages: Math.ceil(totalNotifications / limitNum),
                totalNotifications
            },
            unreadCount
        })
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications' })
    }
})

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }

        await notification.markAsRead()
        res.json({ message: 'Notification marked as read' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notification as read' })
    }
})

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', authenticate, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, readAt: { $exists: false } },
            { readAt: new Date() }
        )
        res.json({ message: 'All notifications marked as read' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notifications as read' })
    }
})

export default router