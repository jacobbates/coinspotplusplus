	/*
	Coinspot++ Google Chrome Extension
	Version: 1.1.0
	Unofficial coinspot.com.au sorting enhancement for tradecoins page
	Author: Jacob A Bates (https://github.com/jacobbates)
	License: GNU AGPLv3 (https://www.gnu.org/licenses/agpl-3.0.txt)
	
	Coinspot++ is not affiliated with Coinspot or coinspot.com.au
	
	Credits:
	Bootstrap v3.1.1 © 2011-2014 Twitter, Inc. | https://github.com/twbs/bootstrap/blob/master/LICENSE
	jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license
	DataTables 1.10.16 ©2008-2017 SpryMedia Ltd | datatables.net/license
	DataTables Bootstrap 3 integration ©2011-2015 SpryMedia Ltd | datatables.net/license
	*/

	/*Function: isOdd
	  Boolean for odd number
	  Coinspot alternates rows for desktop and mobile
	  This is used to check and only append desktop rows to the DOM*/
	function isOdd(num) {
		return num % 2;
	}

	/*Function: CoinTable
	  Where the magic happens
	  Rewrites <ul> and <li> into table rows
	  Also adds bootstrap visibility classes to specific columns hidden on mobile */
	jQuery.fn.CoinTable = function() {
		return this.each(function() {

			var table = $('<table id="CoinTable">');
			var thead = $('<thead>');
			var tbody = $('<tbody>');

			$(this).children('li').each(function(i, li){

				var coin = $(this).data('coin');

				if (i == 0||i == 1){

					//Table Head
					$(li).children("div").each(function(ii, row){
						var tr = $('<tr>');
						$(row).children("div").each(function(iii, col){
							var th = $('<th>');
							if(iii==3||iii==5){
								//If MarketCap OR Buttons Col
								th.append($(this).html()).addClass('hidden-xs hidden-sm');
							}else{
								colhtml = $(this).html()
								if(iii==1||iii==2||iii==4){
									//If Buy OR Sell OR Change Col 
								    var str = colhtml.split(" ");
								    colhtml = str[0]+'<span class="hidden-xs hidden-sm"> '+str[1]+'</span>';
								}
								th.append(colhtml);
							}
							tr.append(th).addClass('row-classss');
						});
						if (!isOdd(i)) {thead.append(tr);}
					});
					table.append(thead);

				} else {

					//Table Body
					$(li).children("div").each(function(ii, row){
						var tr = $('<tr>');
						$(row).children("div").each(function(iii, col){
							var td = $('<td>');
							if(iii==3||iii==5){
								//If MarketCap OR Buttons Col 
								td.append($(this).html()).addClass('hidden-xs hidden-sm');
							}else{
								colhtml = $(this).html()
								if(iii==0){
									//If Coin Col 
								    var str = colhtml.split("&nbsp;");
								    colhtml = str[0]+'<span class="hidden-xs hidden-sm">'+str[1]+'</span><span class="hidden-md hidden-lg hidden-xl">'+coin+'</span>';
								}
								td.append(colhtml);
							}
							tr.append(td).addClass('classss');
						});
						if (!isOdd(i)) {tbody.append(tr.attr("data-coin", coin));}
					});
				}
			});
			$(this).after(table.append(tbody).addClass('table table-hover table-responsive')).remove();
		});
	}

	//JS to execute on Page Load
	$(document).ready(function() {

		//Removes Large 3-Col Panel moving coins up page 
		$('.panel').parent().remove();

		//Removes Existing Filter Input
		$('.filtercoins').parent().remove();
		

		//Converts Coinspot list to Table
		$('ul.listgroup').CoinTable();

		//Initiate Sortable DataTable
		$('#CoinTable').DataTable({
			"order": [[2, 'dsc']],
			"autoWidth": false,
			"pageLength": 20,
			"lengthMenu": [20, 50, 100],
			"language": {
				"lengthMenu": "<div class='input-group'><span class='input-group-addon'><i class='glyphicon glyphicon-th-list'></i></span>_MENU_</div>",
				"info": "Displaying _START_-_END_ of _TOTAL_",
            	"infoFiltered": "(Filtered)",
            	"infoEmpty": "Displaying 0 to 0 of 0",
            	"search": "<div class='input-group'><span class='input-group-addon'><i class='glyphicon glyphicon-search'></i></span>_INPUT_</div>",
            	"paginate": {
            		"next": ">",
            		"previous": "<"
            	},
			}
		});

		//Adds clickable hyperlinks to rows
		$('#CoinTable tbody').on('click', 'tr', function () {
        	var coin = $(this).data("coin");
       		window.location = "/buy/"+coin;
    	} );

    	//Update navbar branding on tradecoins list page to Coinspot++
    	//Avoids confusion about which pages extension effects
    	var branding = $('.navbar-brand').html();
    	$('.navbar-brand').html(branding+"++");

	});

