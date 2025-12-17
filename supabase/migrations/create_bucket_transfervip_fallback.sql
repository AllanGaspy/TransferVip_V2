-- Fallback: directly insert bucket record
insert into storage.buckets (id, name, public)
values ('transfervip', 'transfervip', true)
on conflict (id) do nothing;
