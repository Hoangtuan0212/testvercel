import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]";

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Lấy session từ req, res
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }
    const userId = session.user?.id ? Number(session.user.id) : null;
    if (!userId) {
      return res.status(401).json({ message: "Không xác định được userId" });
    }

    if (req.method === "GET") {
      // Lấy giỏ hàng của user, bao gồm CartItems và sản phẩm liên quan
      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: { CartItems: { include: { product: true } } },
      });
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { CartItems: { include: { product: true } } },
        });
      }
      const cartItems = cart.CartItems ?? [];
      const totalQuantity = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      return res.status(200).json({ cartItems, totalQuantity });
    } else if (req.method === "POST") {
      const { productId, quantity } = req.body;
      if (!productId || !quantity) {
        return res
          .status(400)
          .json({ message: "Thiếu productId hoặc quantity" });
      }
      const qty = Number(quantity);
      if (isNaN(qty) || qty < 1) {
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }
      let cart = await prisma.cart.findFirst({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      });
      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + qty },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity: qty },
        });
      }
      return res.status(200).json({ message: "Đã thêm vào giỏ hàng" });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Lỗi chung /api/cart:", error);
    return res.status(500).json({ message: "Lỗi server không xác định" });
  }
}
