-- =============================================================================
-- 랜딩 페이지 누적 조회수 (단일 행 id=1)
--
-- ⚠️ [자주 나는 오류] 아래처럼 "파일 경로"만 에디터에 넣고 Run 하면 안 됩니다.
--     supabase/migrations/20260322120000_site_page_views.sql   ← 이건 SQL이 아님 → ERROR 42601
--
-- ✅ 올바른 방법: Cursor/VS Code에서 이 파일을 연 뒤, 내용 전체 선택(Ctrl+A) →
--    Supabase Dashboard → SQL Editor 에 붙여넣기 → Run
--    (주석 줄(-- 로 시작) 포함해서 전부 붙여넣어도 됩니다. 경로 문자열만 단독으로 넣지 마세요.)
-- =============================================================================

-- 기존 것 정리 (테이블에 달린 RLS 정책·의존성까지 함께 제거)
drop function if exists public.increment_page_views();
drop table if exists public.site_page_views cascade;

-- 테이블
create table public.site_page_views (
  id int primary key check (id = 1),
  total bigint not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.site_page_views is '사이트 전체 누적 페이지뷰 (행 1개만 사용)';

insert into public.site_page_views (id, total) values (1, 0);

alter table public.site_page_views enable row level security;

-- anon/authenticated 는 테이블에 직접 쓰지 않고 아래 RPC만 호출
create function public.increment_page_views()
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

comment on function public.increment_page_views() is '페이지뷰 +1, 새 total 반환';

grant execute on function public.increment_page_views() to anon;
grant execute on function public.increment_page_views() to authenticated;
