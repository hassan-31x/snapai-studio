import { db } from "./db";
export const cascadeDeleteUser = async (userId: string) => {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    await tx.creditReservation.deleteMany({ where: { userId } });
    await tx.design.deleteMany({ where: { userId } });
    await tx.productImage.deleteMany({ where: { userId } });
    await tx.submission.deleteMany({ where: { userId } });
    await tx.generation.deleteMany({ where: { userId } });
    await tx.twoFactorConfirmation.deleteMany({ where: { userId } });
    await tx.account.deleteMany({ where: { userId } });
    if (user?.email) {
      await tx.verificationToken.deleteMany({ where: { email: user.email } });
      await tx.resetPasswordToken.deleteMany({ where: { email: user.email } });
      await tx.twoFactorToken.deleteMany({ where: { email: user.email } });
    }
    await tx.user.delete({ where: { id: userId } });
  });
  return true;
};
export const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
