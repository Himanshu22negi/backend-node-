const Project = require('../models/project.model');
const User = require('../models/user.model');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private/Admin (Usually Admin checks stats, but maybe User too? Requirement: "API must return...")
// I'll allow both but data might differ if we want restriction. Assuming Admin level stats for now as per "Dashboard Analytics" usually implying overview.
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();

        // Count by status
        const projectsByStatus = await Project.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Projects ending within 7 days
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const expiringProjects = await Project.find({
            endDate: {
                $gte: new Date(),
                $lte: sevenDaysFromNow
            }
        }).select('title endDate status');

        res.json({
            totalUsers,
            totalProjects,
            projectsByStatus,
            expiringProjects
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
