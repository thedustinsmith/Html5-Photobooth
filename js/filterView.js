var FilterView = {

	filterValueTable: $("#filter-value-table"),
	
	initialize: function() {
		var that = this;
		var filterList = $("#filter-type");
		var filterlisttemplate = "<option value='<%= name.toLowerCase().replace(' ', '') %>'><%= name %></option>"
		var filterMarkup = _.map(Filters, function(filter) {
			return _.template(filterlisttemplate, filter);
		}).join("");

		filterList.prepend("<option value=''>None</option>").append(filterMarkup);
		
		filterList.on('change', function() {
			var filterType = $(this).val();
			var filter = Filters[filterType] || undefined;

			//currentFilter = filter.process;
		
			that.showFilter(filter);
			$(that).trigger("filterChange", filter);
		});

		this.filterValueTable.on('change', '.filter-prop-value', function() {
			var propName = $(this).data('prop');
			var filterArgs = {};
			filterArgs[propName] = parseInt(this.value, 10);
			//applyFilter(filterArgs);

			$(that).trigger("filterValueChange", filterArgs);
		});
	},

	showFilter: function(filter) {
		var filterValueTemplate = "<tr><td><label><%- name %></label><input data-prop='<%- name %>' class='filter-prop-value' type='range' min='<%- min %>' max='<%- max %>' /></td></tr>";
		this.filterValueTable.html("");

		if (!filter) {
			return;
		}

		if(filter.properties && filter.properties.length > 0) {
			var filterValueMarkup = _.map(filter.properties, function (prop) {
				return _.template(filterValueTemplate, prop);
			}).join("");


			this.filterValueTable.append(filterValueMarkup);
		}

		//applyFilter({});
	}
};