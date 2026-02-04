import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import logger from '../utils/logger.js'

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ isActive: true })
        const totalCustomers = await User.countDocuments({ role: 'customer' })

        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ])

        const statusCounts = {}
        ordersByStatus.forEach((item) => {
            statusCounts[item._id] = item.count
        })

        res.json({
            totalProducts,
            totalCustomers,
            ordersByStatus: statusCounts,
        })
    } catch (error) {
        logger.error('Get dashboard error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch dashboard data' })
    }
}

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query

        const query = { role: 'customer' }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ]
        }

        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)
        const skip = (pageNum - 1) * limitNum

        const customers = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip(skip)

        const totalItems = await User.countDocuments(query)
        const totalPages = Math.ceil(totalItems / limitNum)

        res.json({
            customers,
            pagination: {
                page: pageNum,
                totalPages,
                totalItems,
            },
        })
    } catch (error) {
        logger.error('Get customers error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch customers' })
    }
}

// @desc    Block/Unblock customer
// @route   PUT /api/admin/customers/:id/block
// @access  Private/Admin
export const toggleBlockCustomer = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id)

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' })
        }

        if (customer.role !== 'customer') {
            return res.status(400).json({ message: 'Can only block customer accounts' })
        }

        customer.isBlocked = !customer.isBlocked
        await customer.save()

        res.json({
            message: `Customer ${customer.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            customer: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                isBlocked: customer.isBlocked,
            },
        })
    } catch (error) {
        logger.error('Toggle block customer error:', { error: error.message })
        res.status(500).json({ message: 'Failed to update customer' })
    }
}

// @desc    Get customer profile (Admin view)
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
export const getCustomerProfile = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id).select('-password')

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' })
        }

        const orders = await Order.find({ customerId: customer._id })
            .sort({ createdAt: -1 })
            .limit(10)

        res.json({
            customer,
            recentOrders: orders,
        })
    } catch (error) {
        logger.error('Get customer profile error:', { error: error.message })
        res.status(500).json({ message: 'Failed to fetch customer profile' })
    }
}
