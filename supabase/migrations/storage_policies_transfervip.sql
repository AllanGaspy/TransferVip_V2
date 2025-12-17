CREATE POLICY "public read transfervip" ON storage.objects
  FOR SELECT USING (bucket_id = 'transfervip');

CREATE POLICY "authenticated upload transfervip" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'transfervip' AND auth.role() = 'authenticated');

CREATE POLICY "authenticated update own transfervip" ON storage.objects
  FOR UPDATE USING (bucket_id = 'transfervip' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'transfervip' AND owner = auth.uid());

CREATE POLICY "authenticated delete own transfervip" ON storage.objects
  FOR DELETE USING (bucket_id = 'transfervip' AND owner = auth.uid());
