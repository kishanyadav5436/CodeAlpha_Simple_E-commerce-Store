const Order = require('../models/Order');
const Product = require('../models/Product');

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

// @desc    Create a new order (checkout)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { items } = req.body; // [{ productId, qty }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Build order items from DB
        const orderItems = [];
        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            const lineTotal = product.price * item.qty;
            subtotal += lineTotal;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                qty: item.qty
            });
        }

        const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const total = subtotal + shipping;

        const order = await Order.create({
            items: orderItems,
            subtotal,
            shipping,
            total
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getOrderById };
