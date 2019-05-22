import Config from "../models/config";

export default async function initProducts() {
  await Config.findOneAndUpdate(
    { active: true },
    {
      autoReply:
        "恭喜您获得免费领取14天VIP会员的机会。(仅限新注册用户）您只需要点击以下链接，根据具体操作，就可直接领取。链接：https://dwz.cn/gOsqwf2g",
      active: true,
    },
    {
      new: true,
      upsert: true,
    }
  );
}
