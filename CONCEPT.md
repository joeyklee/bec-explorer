## Basic concept: BEC climate Data Explorer

* Inspiration: 
	* [http://adaptwest.databasin.org/app/ecoregion_climate_explorer](http://adaptwest.databasin.org/app/ecoregion_climate_explorer)

### Basic application: 
* 1 observation per BEC variant
* 4 windows: 
	* Map 
	* Scatterplot
	* Climate Variable 1 time series
	* Climate Variable 2 time series
* Map shows: 
	* BEC variant boundaries
	* Focal bec variant boundary and representative location
	* Secondary variant and representative location
	* Optional theming by 1o variable, 2o variable, 1o/2o combo, or sigma similarity
	* Scatterplot shows
	* 1971-2000 Climate normals
	* 1971-2000 detrended interannual variability
	* Climate change trajectory 1960s, 1990s, 2020s, 2050s, 2080s. 
	* Ensemble mean and ensemble members
	* Optional theming by 1o variable, 2o variable, 1o/2o combo, or sigma similarity
* Time series show: 
	* Observed 1901-2012
	* Projected 1901-2100 (CanESM2-ES)
	* Projected normals for rest of ensemble
	* Moving average of 1 secondary variant
* Functionality
	* Click on scatterpoint or map polygon to select focal BEC variant
	* Simultaneous highlighting
	* Hover over secondary selection
	* Select primary and secondary climate variable
	* Default/disable log-transformation of zero-limited variables
	* Turn climate trajectory on or off
	* Download data
	* Hover-over data identification
* Optional 
	* Text description of focal and secondary BEC variants
	* FAQs
* Ferrari options
	* North American analog similarity
	* Could be done using subdivided Ecoregions, or raster-based
	* Scale-free focal location via ClimateBC query. 

##Data structure
### Data structured one-to-many on ~200 BEC variant representative locations
* 12 Seasonal basic (Tmin, Tmax, PPT) and ~18 annual bioclimatic variables [k=30]
* 1971-2000 Climate normals [n=1]
* Climate normals for 1960s [1], 1990s [1], 2020s [16], 2050s [16], 2080s [16]. 
* 1971-2000 detrended time series [30]
* Observed 1901-2012 [110]
* Projected 1901-2100 (CanESM2-ES) [200]
* sigma similarity [200,1]
[n,k]=[391,30]+200 = 11930 data points for each BEC variant. 11930*200 = 2,386,000 total data points
* Could be reduced if necessary by eliminating the CanESM2 projection (1.2M data points)
* Basic version with just the CanESM normals projection and no projected time series would be 0.92M data points

### Spatial data for analog identification
* BC: Biogeoclimatic Variants. [14765 polygons] 500Mb shapefile (!)
* Also generalized to 1:20k/250k/2M, so perhaps could manage this with tiling
* Alberta: Natural Subregions of Alberta. [422]
* Rest of Canada: Ecodistricts [1025]
* Alaska: level 3 Ecoregions [366]
* Contiguous US: Level 4 ecoregions [7242]
* Mexico: WWF Ecoregions [588]

### Questions
* where to host the tool? (personal, CFCG, MFLNRO, DataBasin)
* is it possible to query ClimateBC via the tool for scale-free data? 
* what are the limitations on the number and complexity of polygons? 
* Can we obtain the ecoregions explorer leaflet code as a starting template? 

### Communications
* Jan 8: sent an email to Tim Salkeld about getting access to the generalized BECv9 data
* Jan 9: sent an email to Scott nielsen inquiring about the Adaptwest ecoregion explorer. 

### Other relevant websites
* Climate Analog tracker. http://esd.lbl.gov/projects/climate-analog-tracker/
* Is broken
* Climate Analogs tool
* Too many options, not very enjoyable to use
* Does a climate similarity calculation live. That’s pretty cool.
* This approach is applicable to developing a tool for the novelty analysis. 


### General Climate Communication links
* http://cnap.ucsd.edu/cnap_cci.html
