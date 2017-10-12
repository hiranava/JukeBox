//Change row class name, adds selected or removes it.
//Input parameter:param - row id
function songRow(param) {
	$("#" + param).toggleClass("selected")
		.siblings(".selected")
		.removeClass("selected");
}

//toggle between favorite icon selected and not selected
//Input parameter:param - paragraph id.
function swapIcon(param) {
	$("#" + param).toggleClass('glyphicon-star').toggleClass(
			'glyphicon-star-empty')
}

//Calling api to get the album details
var mySwiper;
$.ajax({
	url : 'https://stg-resque.hakuapp.com/albums.json',
	type : 'GET',
	crossDomain : true,
	dataType : 'jsonp',
	success : function(data) {
		for (var i = 0; i < data.length; i++) {
			var cssStyle = "'background-image:url(\""
					+ data[i].cover_photo_url + "\")'";
			var imgStyle = "<div style='margin: 0 auto; width:85%'><img src=\""+data[i].cover_photo_url +"\" style='width:300px;height:300px' /> </div><center><div style='margin: 0 auto; width:65%'>"
					+ data[i].name
					+ "</div></center><center><div style='margin: 0 auto; width:35% font-size:22px'>"
					+ data[i].artist_name + "</div></center>";
			$("#imageCarousel").append(
					"<div class='swiper-slide' pid="
							+ data[i].id
							+ ">"
							+ imgStyle + "</div>");
		}
		mySwiper = new Swiper('.swiper-container',
				{
					pagination : '.swiper-pagination',
					effect : 'coverflow',
					grabCursor : true,
					centeredSlides : true,
					slidesPerView : 'auto',
					coverflow : {
						rotate : 0,
						stretch : 50,
						depth : 100,
						modifier : 1,
						slideShadows : false
					},
					loop : false,
					onTransitionEnd : function() {
						openAlbum($('.swiper-slide-active').attr('pid'));
					},
					nextButton : '.swiper-button-next',
					prevButton : '.swiper-button-prev'
				});
		mySwiper.slideTo(data.length / 2);
	},
	error : function() {
		alert('Failed!');
	}

});

//Calling api to get the song details of the selected album. 
//Input parameter: id - Album id
function openAlbum(id) {
	
	if (id == "")
		return;
	$("#songTable").empty();
	
	$.ajax({

		url : 'https://stg-resque.hakuapp.com/songs.json?album_id='+ id,
		type : 'GET',
		crossDomain : true,
		dataType : 'jsonp',
		success : function(data) {
			$("#songTable").empty();
			$("#songTable").append("<tbody>");
			for (var i = 0; i < data.length; i++) {
				var songTags = data[i].song_name;
				if (data[i].song_label != null) {
					for (var j = 0; j < data[i].song_label.length; j++) {
						songTags = songTags
								+ "  <span class='tags' >"
								+ data[i].song_label[j]
										.toUpperCase()
								+ "</span>";
					}
				}
				
				$("#songTable")
						.append(
								"<tr id='row"
										+ i
										+ "' height='50' onclick=songRow(this.id) ><td class='song'><span class='songNum'>"
										+ (i + 1)
										+ "</span></td><td><a href='#'  data-toggle='tooltip' data-placement='top' title='MARK AS FAVORITE'><p id='favtoggle"
										+ i
										+ "' onclick=swapIcon(this.id) class='glyphicon glyphicon-star-empty'></p></a></td><td> "
										+ songTags + " </td>"
										+ "<td>"
										+ data[i].song_duration
										+ "</td></tr>");
				$("#songTable").append("</tbody>");
			}
		}
	});
}