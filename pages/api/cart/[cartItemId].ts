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
    // Debug log: hiển thị các thông tin của request
    console.log("=== [cartItemId].ts ===");
    console.log("req.method:", req.method);
    console.log("req.url:", req.url);
    console.log("req.query:", req.query);
    console.log("req.body:", req.body);

    // Lấy session từ req, res
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in [cartItemId]:", session);
    if (!session) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }
    const userId = session.user?.id ? Number(session.user.id) : null;
    if (!userId) {
      return res.status(401).json({ message: "Không xác định được userId" });
    }

    // Lấy tham số cartItemId từ query
    const { cartItemId } = req.query;
    let idStr = "";
    if (typeof cartItemId === "string") {
      idStr = cartItemId;
    } else if (Array.isArray(cartItemId)) {
      idStr = cartItemId[0];
    }
    console.log("idStr:", idStr);
    const parsedId = parseInt(idStr, 10);
    if (isNaN(parsedId)) {
      console.log("Parse cartItemId thất bại:", idStr);
      return res.status(400).json({ message: "cartItemId không hợp lệ" });
    }
    console.log("cartItemId:", parsedId);

    // Tìm CartItem theo ID và kiểm tra quyền sở hữu
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parsedId },
      include: { cart: true },
    });
    console.log("CartItem found:", cartItem);
    if (!cartItem || cartItem.cart.userId !== userId) {
      return res.status(404).json({
        message: "CartItem không tồn tại hoặc không thuộc user này",
      });
    }

    if (req.method === "PATCH" || req.method === "PUT") {
      // Lấy quantity từ req.body và ép về số
      const { quantity } = req.body;
      console.log("PATCH => raw quantity:", quantity);
      const qty = Number(quantity);
      if (isNaN(qty) || qty < 1) {
        console.log("Quantity không hợp lệ:", quantity);
        return res.status(400).json({ message: "Số lượng không hợp lệ" });
      }
      await prisma.cartItem.update({
        where: { id: parsedId },
        data: { quantity: qty },
      });
      console.log("CartItem updated:", parsedId, "New quantity:", qty);
      return res.status(200).json({ message: "Đã cập nhật số lượng" });
    } else if (req.method === "DELETE") {
      await prisma.cartItem.delete({ where: { id: parsedId } });
      console.log("CartItem deleted:", parsedId);
      return res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
    } else {
      res.setHeader("Allow", ["PATCH", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Lỗi chung /api/cart/[cartItemId]:", error);
    return res.status(500).json({ message: "Lỗi server không xác định" });
  }
}
