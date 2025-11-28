import { Router } from "express";
import { User } from "../models/User.model.js";

export const usersRouter = Router();

// GET /api/user
usersRouter.get("/", async (req, res, next) => {
    try {
        const users = await User.find().lean();
        res.json(users);
    }catch (err) { next(err); }

});

// GET /api/users/:id
usersRouter.get("/:id", async (req, res, next) => {
    try{
        const id = req.params.id;
        const user = await User.findById( id ).lean();
        if(!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    }catch (err) { next(err); } 
});

// POST /api/users
usersRouter.post("/", async (req, res, next) => {
    try{
        const created = await User.create(req.body);
        res.status(201).json(created);
    }catch (err) { next(err); } 
});

// PUT /api/users/:id
usersRouter.put( "/:id", async(req,res,next)=>{
    try{
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new:true, runValidators:true }
        ).lean();
        if(!updated) return res.status(404).json({ error: "User not found" });
        res.json(updated);
    } catch (err) { next(err);} 
});

// DELETE /api/users/:id
usersRouter.delete( "/id", async( req,res,next ) => {
    try{
        const id = req.params.id;
        const deleted = await User.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json({ error: "User not found" });
        res.status(204).send();
    } catch (err) { next(err);} 
} );