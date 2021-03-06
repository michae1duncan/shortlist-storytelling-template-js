define([
		"lib-build/css!./MobileFeatureList",
		"lib-build/css!lib-app/Swiper/swiper.min",
		"lib-app/Swiper/swiper"
	],
	function(){
		return function MobileFeatureList(container, isInBuilder, saveData, mainView)
		{
			var _mainView = mainView;
			var _firstLoad = true;
			var _swiper = null;
			var _swiperContainer = $('#mobileThemeBarSlider');
			app.scrollList;

			this.init = function()
			{

				_swiper = new Swiper('#mobileThemeSliderContainer', {
					speed: 0,
					direction: 'horizontal'
				});

				_swiper.on('onSlideChangeEnd', function(swiper){
					if($('#mobileThemeBar').css('visibility') ==  'visible')
						_mainView.activateLayer(_swiper.activeIndex);
					setNavControls(_swiper.activeIndex);
					$('#mobileThemeBar').css('background-color', app.layerCurrent.color);
				});

				initEvents();
			};

			this.addTheme = function(value, oneTheme)
			{
				// initMap, after contentLayers are set if more than one tab layer
				var themeTitle = ('<div class="mobileThemeTitle swiper-slide"><p style="margin-top: 7px;">' + value.title + '</p></div>');
				$(_swiperContainer).append(themeTitle);
				_swiper.update();
				if(oneTheme){
					$('#mobileThemeBar .swiper-container').css('display', 'none');
					$('#navThemeLeft').css('display', 'none');
					$('#navThemeRight').css('display', 'none');
				}
			};

			this.showMobileList = function()
			{
				$('#mobileFeature').css('visibility', 'hidden');
				$('#mobileSupportedLayersView').css('visibility', 'hidden');
				$('#mobileThemeBarSlider').css('display', 'block');
				$('#mobilePaneList').css('visibility', 'visible');
				$('#returnIcon').css('display', 'none');
				$('#returnHiddenBar').css('display', 'none');
				$('#centerMapIconContainer').css('display', 'none');
				$('#navThemeLeft').css('visibility', 'visible');
				$('#navThemeRight').css('visibility', 'visible');
				if (_mainView.selected) {
					_mainView.selected.symbol.setWidth(app.cfg.lutIconSpecs.tiny.getWidth());
					_mainView.selected.symbol.setHeight(app.cfg.lutIconSpecs.tiny.getHeight());
					_mainView.selected.symbol.setOffset(app.cfg.lutIconSpecs.tiny.getOffsetX(), app.cfg.lutIconSpecs.tiny.getOffsetY());
					_mainView.selected.draw();
				}

				_mainView.selected = null;
				if(app.mapTips)
					app.mapTips.clean(true);
				$(".detailContainer").hide();
				_swiper.update();
			};

			this.selectTheme = function(themeIndex)
			{
				if (_firstLoad) {
					_swiper.slideTo(themeIndex, 0);
				}
				else {
					_swiper.slideTo(themeIndex, 0);
					$('#mobileTitlePage').css('display', 'none');
				}

				/*if (_firstLoad) {
					$('#mobileThemeBarSlider').slick('slickGoTo', themeIndex, true);
				}
				else {
					$('#mobileThemeBarSlider').slick('slickGoTo', themeIndex, true);
					$('#mobileTitlePage').css('display', 'none');
				}*/
				_firstLoad = false;
				$('#mobileThemeBar').css('background-color', app.layerCurrent.color);
				setNavControls(themeIndex);
			};

			this.buildList = function(index, value, tile)
			{
				if(index === 0){
					$('#mobileList').empty();
				}

				var mobileTile = $(tile).clone();
				$(mobileTile).data('shortlist-id', value.attributes.shortlist_id);
				var picUrl = value.attributes.thumb_url ? value.attributes.thumb_url : value.attributes.pic_url;
				var mobileImg = $('<div style="height: 75px; margin-bottom: 8px;"><img src="'+picUrl+'"></div>');
				$(mobileTile).append(mobileImg);
				$("#mobilePaneList ul.mobileTileList li").on('tap', app.ui.tilePanel.tile_onClick);
				$("#mobilePaneList ul.mobileTileList li").on('click', app.ui.tilePanel.tile_onClick);
				$('#mobileList').append(mobileTile);
			};

			this.setColor = function()
			{
				if(app.isInBuilder)
					return;
				$('#mobileThemeBar').css('background-color', app.layerCurrent.color);
			};

			this.refreshMobileList = function()
			{
				//var tile;
				var mobileTile;
				var visibleFeatures = false;
				if(app.layerCurrent && app.layerCurrent.graphics.length){
					setTimeout(function(){
						$.each(app.layerCurrent.graphics,function(index,value){
							//find the corresponding tile
							mobileTile = findMobileTile(value.attributes.shortlist_id);
							if (app.map.extent.contains(value.geometry)) {
								//if ($(tile).css("display") == "none") $(tile).stop().fadeIn();
								if ($(mobileTile).css("display") == "none") $(mobileTile).css("display", "block") ;
								visibleFeatures = true;
							} else {
								//if ($(tile).css("display") != "none") $(tile).stop().fadeOut(1000);
								if ($(mobileTile).css("display") != "none") $(mobileTile).css("display", "none");
							}
						});

						$('#mobilePaneList').scrollTop(0);

						if(!visibleFeatures)
							$('.noFeature').css('display', 'block');
						else
							$('.noFeature').css('display', 'none');
					}, 100);
				}
			};

			function initEvents()
			{
				$('#navThemeRight').on('click', function(){
					_swiper.slideNext();
					//$('#mobileThemeBarSlider').slick('slickNext');
				});
				$('#navThemeLeft').on('click', function(){
					_swiper.slidePrev();
					//$('#mobileThemeBarSlider').slick('slickPrev');
				});
				/*$('#mobileThemeBar').on('click', function(){
					hideBookmarks();
				});*/
			}

			function setNavControls(themeIndex)
			{
				// from activateLayer

				if (themeIndex === 0 && _swiper.slides.length > 1) {
					$('#navThemeLeft').css('display', 'none');
					$('#navThemeRight').css('display', 'block');
				}
				else
					if (themeIndex == (_swiper.slides.length - 1)) {
						$('#navThemeRight').css('display', 'none');
						$('#navThemeLeft').css('display', 'block');
					}
				else {
					$('#navThemeLeft').css('display', 'block');
					$('#navThemeRight').css('display', 'block');
				}

				/*if (themeIndex === 0 && $('#mobileThemeBarSlider').find('.slick-slide').length > 1) {
					$('#navThemeLeft').css('display', 'none');
					$('#navThemeRight').css('display', 'block');
				}
				else
					if (themeIndex == ($('#mobileThemeBarSlider').find('.slick-slide').length - 1)) {
						$('#navThemeRight').css('display', 'none');
						$('#navThemeLeft').css('display', 'block');
					}
				else {
					$('#navThemeLeft').css('display', 'block');
					$('#navThemeRight').css('display', 'block');
				}*/
			}

			function findMobileTile(id)
			{
				return $.grep($("ul.mobileTileList li"),function(n,i){return n.id == "item"+id;})[0];
			}

		};
	}
);
