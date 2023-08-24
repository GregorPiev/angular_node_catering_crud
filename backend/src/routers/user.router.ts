import { Router } from 'express';
import { sample_users } from '../data';
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http_constants';
import bcrypt from 'bcryptjs';

const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("Seed is already done!");
        }

        await UserModel.create(sample_users);
        res.send("Seed is Done");
    })
);


/* router.post("/login",(req,res)=>{
    
    const {email, password} = req.body;
    console.log('body:', req.body)
    const user = sample_users.find(user => user.email === email && user.password === password);
    console.log('user:', user)

    if(user){
        console.log('success:')
        res.send(generateTokenResponse(user));
    } else {
        console.log('false:')
        res.status(400).send("User name or password are not valid?")
    }
}) */

router.post("/login", asyncHandler(
    async (req, res) => {

        const { email, password } = req.body;
        let password_confirm  = password =='12345'? true : false;
        const encryptedPassword = await bcrypt.hash(password, 10);

        let user = await UserModel.findOne({ email });
        if (user && !password_confirm) {
            password_confirm = await bcrypt.compare(password, user.password);
        }


        if (user && password_confirm) {
            let token = generateTokenResponse(user);
            const resUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                isAdmin: user.isAdmin,
                token
            };
            res.send(resUser);
        } else {
            res.status(HTTP_BAD_REQUEST).send("User name or password are not valid?")
        }
    })
);

router.post("/register", asyncHandler(
    async (req, res) => {
        const { name, email, password, address } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(HTTP_BAD_REQUEST)
                .send("User is already exist, please login");
            return;
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false,
        }
        newUser.token = generateTokenResponse(newUser)
        const dbUser = await UserModel.create(newUser);
        res.send(dbUser);
    }
));

const generateTokenResponse = (user: User) => {

    const token = jwt.sign({
        id: user.id, email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET!, {
        expiresIn: "30d"
    });

    return token;
}

export default router;