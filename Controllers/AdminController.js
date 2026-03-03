import User from "../Models/UserSchmea.js";

/* ================= GET ALL USERS (with search, sort, filter, pagination) ================= */
export const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            role = "",
            status = "",
            sortField = "createdAt",
            sortOrder = "desc"
        } = req.query;

        const query = {};

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by role
        if (role) {
            query.role = role;
        }

        // Filter by status (active/inactive)
        if (status) {
            query.active = status === "active";
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Sorting
        const sort = {};
        sort[sortField] = sortOrder === "desc" ? -1 : 1;

        const users = await User.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select("-password"); // Exclude passwords

        const totalUsers = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                total: totalUsers,
                page: Number(page),
                pages: Math.ceil(totalUsers / limit),
            },
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/* ================= TOGGLE USER STATUS (Active/Inactive) ================= */
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Toggle the active status
        user.active = !user.active;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.active ? "activated" : "deactivated"} successfully`,
            data: { id: user._id, active: user.active },
        });
    } catch (error) {
        console.error("Toggle user status error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
