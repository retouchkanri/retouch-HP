import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// nodemailer は Node ランタイムが必要（Edge 不可）
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  agree?: boolean;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const topic = (data.topic ?? "（未選択）").trim();
  const message = (data.message ?? "").trim();

  // 入力バリデーション
  if (!name || !email || !phone || !message) {
    return NextResponse.json({ ok: false, error: "必須項目が入力されていません。" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "メールアドレスの形式が正しくありません。" }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "お問い合わせ内容が長すぎます。" }, { status: 400 });
  }

  // SMTP 設定（環境変数）
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
    console.error("[contact] SMTP env vars are not configured");
    return NextResponse.json(
      { ok: false, error: "サーバーのメール設定が未完了です。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }

  const port = Number(SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465: SSL / 587: STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `【お問い合わせ】${topic}（${name} 様）`;
  const lines = [
    `お名前：${name}`,
    `メール：${email}`,
    `電話番号：${phone}`,
    `種別：${topic}`,
    "",
    "お問い合わせ内容：",
    message,
  ];
  const text = lines.join("\n");
  const html = `
    <div style="font-family:sans-serif;line-height:1.8;color:#1f2a22">
      <h2 style="color:#26502f">Retouch お問い合わせ</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#5e9a6a">お名前</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#5e9a6a">メール</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#5e9a6a">電話番号</td><td>${escapeHtml(phone)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#5e9a6a">種別</td><td>${escapeHtml(topic)}</td></tr>
      </table>
      <p style="margin-top:16px;white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>`;

  // Gmail は送信元アドレス＝認証アカウントである必要がある。
  // CONTACT_FROM が "Name <email>" 形式ならそのまま、表示名のみなら SMTP_USER を住所に使う。
  const from =
    CONTACT_FROM && CONTACT_FROM.includes("@")
      ? CONTACT_FROM
      : { name: CONTACT_FROM || "Retouch お問い合わせ", address: SMTP_USER };

  try {
    await transporter.sendMail({
      from,
      to: CONTACT_TO,
      replyTo: `${name} <${email}>`, // 返信すると問い合わせ者へ届く
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json(
      { ok: false, error: "送信に失敗しました。お手数ですが時間をおいて再度お試しください。" },
      { status: 502 }
    );
  }

  // 問い合わせ者への自動返信メール（失敗しても問い合わせ自体は成功扱い）
  try {
    const replySubject = "【Retouch】お問い合わせを受け付けました";
    const replyText = [
      `${name} 様`,
      "",
      "この度は、Retouchへのお問い合わせ・メッセージを頂きまして誠にありがとうございます。",
      "内容を確認させて頂き、随時、ご返答させて頂きます。",
      "今後とも、引き続きよろしくお願いいたします。",
      "",
      "Retouch　事務局",
    ].join("\n");
    const replyHtml = `
      <div style="font-family:sans-serif;line-height:1.9;color:#1f2a22">
        <p>${escapeHtml(name)} 様</p>
        <p>
          この度は、Retouchへのお問い合わせ・メッセージを頂きまして誠にありがとうございます。<br />
          内容を確認させて頂き、随時、ご返答させて頂きます。<br />
          今後とも、引き続きよろしくお願いいたします。
        </p>
        <p style="margin-top:16px;color:#26502f">Retouch　事務局</p>
      </div>`;
    await transporter.sendMail({
      from,
      to: `${name} <${email}>`,
      replyTo: CONTACT_TO,
      subject: replySubject,
      text: replyText,
      html: replyHtml,
    });
  } catch (err) {
    // 自動返信が失敗しても、運営側への通知は完了しているため成功を返す
    console.error("[contact] auto-reply failed:", err);
  }

  return NextResponse.json({ ok: true });
}
