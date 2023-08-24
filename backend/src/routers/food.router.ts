import { Router } from "express";
import { sample_food, sample_tags } from "../data";
import asyncHandler from 'express-async-handler';
import { FoodModel } from '../models/food.model';

const router = Router();

router.get("/seed", asyncHandler(
    async (req, res) => {
        const foodCount = await FoodModel.countDocuments();
        if (foodCount > 0) {
            res.send("Seed is already done!");
        }
        
        await FoodModel.create(sample_food);
        res.send("Seed is Done");
    })
);

/* router.get("/", (req, res) => {
    res.send(sample_food);
}); */

router.get("/",asyncHandler(
    async (req,res) =>{
        const foods = await FoodModel.find();
        res.send(foods);
    })
);

/* router.get("/search/:searchTerm", (req, res) => {
    const searchTerm = req.params.searchTerm;
    const foods = sample_food
        .filter(food => food.name.toLowerCase()
            .includes(searchTerm.toLowerCase()));
    res.send(foods);
}); */

router.get("/search/:searchTerm", asyncHandler(
    async (req, res) => {
       const searchRegex = new RegExp(req.params.searchTerm, 'i');
       const foods = await FoodModel.find({name: {$regex: searchRegex}});
       res.send(foods);
   })
);

/* router.get("/tags", (req, res) => {
    res.send(sample_tags);
}); */

router.get("/tags", asyncHandler(
    async(req, res) => {
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group:{
                    _id: '$tags',
                    count:{$sum: 1}
                }
            },
            {
                $project:{
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({count: -1});

        const all = {
            name: 'All',
            count: await FoodModel.countDocuments()
        }

        tags.unshift(all);
        res.send(tags);
    })
);

/* router.get("/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const foods = tagName == 'All' ?
        sample_food :
        sample_food.filter((food) => food.tags?.includes(tagName));
    res.send(foods);
}); */

router.get("/tag/:tagName", asyncHandler(
    async(req, res) => {
        const foods = await FoodModel.find({tags: req.params.tagName})
        res.send(foods);
    })
);

/* router.get("/:foodId", (req, res) => {
    const foodId = req.params.foodId;
    const food = sample_food.find(food => food.id == foodId);
    res.send(food);
}); */

router.get("/:foodId", asyncHandler(
    async(req, res) => {
        const foodId = req.params.foodId;
        const food = await FoodModel.findById(foodId);
        res.send(food);
    })
);

export default router;