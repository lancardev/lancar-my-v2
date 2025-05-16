export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email diperlukan" });
  }

  const secretKey = process.env.TOYYIBPAY_SECRET;
  const categoryCode = process.env.TOYYIBPAY_CATEGORY;

  const bodyData = new URLSearchParams({
    userSecretKey: secretKey,
    categoryCode: categoryCode,
    billName: "Pendaftaran Pengguna Lancar.my",
    billDescription: "Akses penuh untuk bina landing page",
    billPriceSetting: "fixed",
    billPayorInfo: "true",
    billAmount: "100", // RM1.00 (dalam sen)
    billReturnUrl: "https://www.lancar.my/successpayment.html?email=" + email + "&status_id=1",
    billCallbackUrl: "",
    billExternalReferenceNo: Date.now().toString(),
    billTo: email,
    billEmail: email
  });

  try {
    const response = await fetch("https://dev.toyyibpay.com/index.php/api/createBill", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyData.toString()
    });

    const result = await response.json();
    if (Array.isArray(result) && result[0].BillCode) {
      return res.status(200).json({ billCode: result[0].BillCode });
    } else {
      return res.status(400).json({ error: "Gagal cipta bill", detail: result });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
