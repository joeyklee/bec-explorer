# 0. Simplify the geometries - 50m? 100m? 200m?
ogr2ogr -simplify 200 BGCv10beta_200m.shp BGCv10beta.shp
# 1. reproject to wgs84 mercator
ogr2ogr -f 'GeoJSON' BGCv10beta_200m_wgs84.geojson -t_srs "EPSG:4326" BGCv10beta_200m.shp
# 2. 
cd data/SpatialData/GCv10beta
topojson --properties -o BGCv10beta_200m_wgs84.topojson -- BGCv10beta_200m_wgs84.geojson
topojson --properties AREA -o BGCv10beta_200m_wgs84_area.topojson -- BGCv10beta_200m_wgs84.geojson