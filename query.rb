require 'net/http'
require 'pp'
require 'JSON'

# median income
not_included_states = [3, 7, 52, 43, 14] # these GeoIDs were not included in the ACS 2014 5 year release
geo_ids = []
table_ids = ['B19013']

for i in 1..56
  next if not_included_states.include?(i)

  geo_id = "04000US"
  geo_id += '0' if i < 10
  geo_id += i.to_s

  geo_ids << geo_id
end

for c in 'A'..'I'
  table_ids << 'B19013' + c
end

uri = URI("http://api.censusreporter.org/1.0/data/show/latest?table_ids=#{table_ids.join(',')}&geo_ids=#{geo_ids.join(',')}")
res = Net::HTTP.get(uri)
formatted_res = JSON.pretty_generate(JSON.parse(res))

File.open('median_income.json', 'w') { |file| file.write(formatted_res) }

# employment
table_ids = []
for c in 'A'..'I'
  table_ids << 'C23002' + c
end
uri = URI("http://api.censusreporter.org/1.0/data/show/latest?table_ids=#{table_ids.join(',')}&geo_ids=#{geo_ids.join(',')}")
res = Net::HTTP.get(uri)
formatted_res = JSON.pretty_generate(JSON.parse(res))

File.open('employment.json', 'w') { |file| file.write(formatted_res) }
