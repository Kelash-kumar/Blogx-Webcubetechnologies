import { connectDB } from "../../config/db.js";
import { AuthService } from "../../modules/auth/auth.service.js";
import User from "../../modules/user/user.model.js";
import { logger } from "../../common/utils/logger.js";

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminData = {
            name: "System Admin",
            username: "admin",
            email: "admin@blogx.com",
            password: "Admin@123",
            role: "admin",
        };

        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            logger.info("Admin already exists. Skipping seeder.");
            process.exit(0);
        }

        // Using AuthService to ensure consistent registration logic (hashing, validation checks, etc.)
        const admin = await AuthService.register(adminData);

        logger.info(`Admin user created successfully via AuthService: ${admin.email}`);
        process.exit(0);
    } catch (error) {
        logger.error(`Error seeding admin: ${error}`);
        process.exit(1);
    }
};

seedAdmin();
