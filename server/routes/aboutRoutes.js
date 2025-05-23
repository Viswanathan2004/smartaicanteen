import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    title: "About Smart AI Canteen",
    description:
      "Smart AI Canteen is a platform that brings AI to your dining experience, offering fast ordering, tasty food, and eco-friendly operations.",
  });
});

export default router;
