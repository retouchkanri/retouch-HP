-- 馬紹介ページ拡充（2026-10）
-- Supabase Dashboard → SQL Editor で実行してください。何度実行しても安全です。
-- https://supabase.com/dashboard/project/kwytnjcghauwbqzgwnxo/sql

-- 1. 追加カラム
--    photos      … 写真URL（最大10枚、先頭がメイン写真）
--    youtube_url … 馬ごとの YouTube プレイリストURL
--    rescued_at  … 肥育場からの保護年月（"YYYY-MM" または "YYYY"）
alter table public.horses add column if not exists photos text[] not null default '{}';
alter table public.horses add column if not exists youtube_url text;
alter table public.horses add column if not exists rescued_at text;

-- 2. 既存のメイン写真を photos の1枚目として引き継ぐ
update public.horses
   set photos = array[photo]
 where photo is not null
   and photo <> ''
   and cardinality(photos) = 0;

-- 3. ステータスを3区分へ統一
--    protected = リタッチ在籍馬 / owner = オーナー決定馬 / other = その他・退厩等
--    旧「卒業馬（graduated）」はオーナー決定馬として扱う。
update public.horses set status = 'owner' where status = 'graduated';
update public.horses set status = 'protected' where status not in ('protected', 'owner', 'other');

update public.horses
   set status_label = case status
         when 'protected' then 'リタッチ在籍馬'
         when 'owner' then 'オーナー決定馬'
         else 'その他・退厩等'
       end;

alter table public.horses alter column status_label set default 'リタッチ在籍馬';

-- owner_story カラムは「事務局からのメッセージ」として引き続き使用します（カラム名は変更なし）。
comment on column public.horses.owner_story is '事務局からのメッセージ';

-- 4. 画像バケット（公開）。管理画面からのアップロード先。
insert into storage.buckets (id, name, public)
values
  ('horse-images', 'horse-images', true),
  ('media-image', 'media-image', true),
  ('news-images', 'news-images', true)
on conflict (id) do update set public = true;
