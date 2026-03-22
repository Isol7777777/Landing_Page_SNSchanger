-- 랜딩 페이지 누적 조회수 (단일 행)
-- Supabase Dashboard → SQL Editor 에서 한 번 실행해도 됩니다.

create table if not exists public.site_page_views (
  id int primary key check (id = 1),
  total bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_page_views (id, total) values (1, 0)
on conflict (id) do nothing;

alter table public.site_page_views enable row level security;

-- anon은 직접 테이블 수정 불가 → RPC만 사용
create or replace function public.increment_page_views()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_total bigint;
begin
  update public.site_page_views
  set total = total + 1, updated_at = now()
  where id = 1
  returning total into new_total;
  return coalesce(new_total, 0);
end;
$$;

grant execute on function public.increment_page_views() to anon;
grant execute on function public.increment_page_views() to authenticated;
