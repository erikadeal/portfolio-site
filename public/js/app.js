/**
 * APP
 *
 * Main site JavaScript file. Includes modules for each
 * component of UI functionality.
 */

var App = {

	init: function(){
		var self = this;
		var skills = document.getElementById('skills');

		if(skills != null) {
			var i = 1;

			$('.skill').each(function() {
				var el = '#' + $(this).find('div.skill-gauge').attr('id');
				var fill = parseInt($(this).attr('data-fill'));
				var start = parseInt($(this).attr('data-start'));
				var end = 100 - (fill + start);
				
				var data = [
					{
						"label": "start",
						"data": start
					},
					{
						"label": "fill",
						"data": fill
					},
					{
						"label": "end",
						"data": end
					}
				];

				self.appendGauge(el, i, start, data, fill);
				i++;
			});
		}

		self.initTimeline();
		self.initProjects();
		self.initNav();
		self.initMobileNav();
	},

	appendGauge: function(el, i, start, data, fill){
		var self = this;
		var offset = $(window).height();

	   // Define style options
	   var width = $(el).width() * 0.8;
	   var height = width;
	   var radius = Math.min(width, height) / 2;

	   var loadData = [
	   		{
	   			"label": "load",
	   			"data": 100
	   		}
	   ];

		// Define the boundaries of the arc
		var arc = d3.svg.arc()
						.innerRadius(radius * 0.8)
						.outerRadius(radius * .9);

		var color = d3.scale.ordinal()
    		.range(["#ecebeb", "#3498db", "#ecebeb"]);

    	var delay = 300;

	    var svg = d3.select(el)
	                  .append('svg')
							.attr('width', width)
							.attr('height', height)
							.append('g')
							.attr('class', 'chart')
							.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2 ) + ')');

		var loadPie = d3.layout.pie()
							.value(function(d) { return d.data; })
							.sort(null);

		var loadSlice = svg.selectAll('.loadPie')
							.data(loadPie(loadData))
							.enter()
							.append('g')
							.attr('class', 'loadPie');

		loadSlice.append('path')
				 .attr('d', arc)
				 .attr('fill', "#ecebeb");

		// Append a big number in the middle 
		svg.append('g')
		  .attr('class', 'stat')
		  .attr('transform', 'translate(-70, 25)')
		  .append('text')
		  .style('font-family', 'Montserrat')
		  .style('font-size', '70px')
		  .attr('fill', '#3498db')
		  .text(fill + '%');

  		var waypoint = new Waypoint({
		  element: el,
		  handler: function() {
		    self.appendFill(svg, data, delay, start, color, arc);
		  },
		  offset: offset * .8
		});
	},

	appendFill: function(svg, data, delay, start, color, arc) {
		var pie = d3.layout.pie()
							.startAngle(0)
							.endAngle(2*Math.PI)
							.value(function(d) { return d.data; })
							.sort(null);

		// Append a slice for each item in the dataset
		var slice = svg.selectAll('.slice')
								.data(pie(data))
								.enter()
								.append('g')
								.attr('class', 'slice');

		// Append a path with a load animation
		slice.append('path')
				.attr('d', arc)
				.style('opacity', function(d, i) {
					if(d.data.label === 'fill') {
						return 0;
					} else {
						return 1;
					}
				})
				.attr('fill', function(d, i) { 
					return color(d.data.label);
				})
				.transition()
				    .duration(500)
				    .delay(delay)
				    .style('opacity', 1)
				    .attrTween("d", tween);

		var tweenStart = (start / 100) * (2*Math.PI);

		function tween(b) {
		  var i = d3.interpolate({startAngle: tweenStart, endAngle: 2*Math.PI}, b);
		  return function(t) { return arc(i(t)); };
		}
	},

	initTimeline: function() {
		var offset = $(window).height();
		var i = 1;

		$('.experience-wrap').each(function() {
			var el = $(this);
			var position = i;

	  		var down = new Waypoint({
			  element: el,
			  handler: function(down) {
			     el.addClass('slide-in');
			  },
			  offset: offset * .9
			});

			i++;
		});
	},

	initProjects: function() {
		var offset = $(window).height();
		$('.project-container').each(function() {
			var el = $(this);

			var waypoint = new Waypoint({
			  element: el,
			  handler: function(down) {
			    el.children('div.project').addClass('fade-in');
			  },
			  offset: offset * .9
			});
		});
	},

	initNav: function() {
		var pointer;

		$('.main-nav__item').on('click', 'a', function(e) {
			e.preventDefault();
			$('.main-nav__item a.active').removeClass('active');
			$(this).addClass('active');

			pointer = $(this).attr('href');
			// Are we on the homepage? If not, redirect
			if(window.location.pathname !== '/') {
				window.location.href = window.location.origin + pointer;
			}
			else if(pointer.indexOf('#') > -1) {
			    $('html, body').scrollTo($(pointer), 500);
			}
			else {
				window.location.href = window.location.origin;
			}
		});

		// Add a colored border to a nav item when you scroll past
		// the corresponding section. This makes the behavior of the 
		//active link more consistent.
		$('.section').each(function() {
			var el = $(this);
			var href = '#' + el.attr('id');

			var waypoint = new Waypoint({
			  element: el,
			  handler: function(down) {
			  	$('.main-nav__item a.active').removeClass('active');
			    $('.main-nav__item a[href=' + href + ']').addClass('active');
			    $('.mobile-nav__item a.active').removeClass('active');
			    $('.mobile-nav__item a[href=' + href + ']').addClass('active');
			  },
			  offset: 50
			});
		});
	},

	initMobileNav: function() {
	    var pointer;

	    $('body').append('<div class="overlay"></div>');

	    // Append overlay for later use
	    $('.mobile-nav-toggle').on('click', function() {
	    	if($('.mobile-nav').hasClass('open')) {
	    		$('.mobile-nav').removeClass('open');
	    		$('.mobile-nav').animate({ "left": "-60%"}, 300);
	    		$('.overlay').hide();
	    	} else {
	    		$('.mobile-nav').addClass('open');
	    		$('.mobile-nav').animate({ "left": "0px"}, 300);
	    		$('.overlay').show();
	    	}
	    });

	    $('.overlay').on('click', function() {
	    		$('.mobile-nav').removeClass('open');
	    		$('.mobile-nav').animate({ "left": "-60%"}, 300);
	    		$(this).hide();
	    });

	    // Scroll to the selected section. This should probably be handled
	    // better since it is an exact duplicate of what is happening above
		$('.mobile-nav__item').on('click', 'a', function(e) {
			e.preventDefault();
			$('.mobile-nav__item a.active').removeClass('active');
			$(this).addClass('active');

			pointer = $(this).attr('href');
			// Are we on the homepage? If not, redirect
			if(window.location.pathname !== '/') {
				window.location.href = window.location.origin + pointer;
			}
			else if(pointer.indexOf('#') > -1) {
			    $('html, body').scrollTo($(pointer), 500);
			}
			else {
				window.location.href = window.location.origin;
			}
		});
	}
};

App.init();