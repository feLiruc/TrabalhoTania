$(function() {

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	var tamanho;	

	$('#enviar').on('click',function(){
		tamanho = $("#tamanho").val();
		if(isNumeric(tamanho)){
			var tabela = "<table class='tabelinha'>";
			tabela += "<caption>K = 0</caption>";
			for(i = 1; i <= tamanho; i++){
				tabela += "<tr>";
				for(j = 0; j <= tamanho; j++){
					if(j==(tamanho)){
						tabela += "<td class='naomexa'></td>";
					}
					tabela += "<td class='celula'>";
					tabela += "<input type='text' class='valor' name='val"+i+""+j+"'>";
					tabela += "</td>";
				}
				tabela += "</tr>";
			}


			tabela += "</table>";
			tabela += "<input type='submit' value='Calcular' id='calcular'>";
		}
		$('.estilizacaoTabela').html(tabela);

		$('.inicioRespostas').html('');
		$('.matrizL').html('');
		$('.matrizU').html('');
		$('.matrizB').html('');

		$('#calcular').on('click',function(){

			$('.inicioRespostas').html("");

			var $rows= $(".tabelinha tbody tr");
			var valores = [];

			$rows.each(function(row, v) {
				$(this).find(".valor").each(function(cell, v) {
					if (typeof valores[cell] === 'undefined') {
						valores[cell] = [];
					}
					valores[row][cell] = $(this).val();
				});
			});

			var m = 0;
            var k = 0;
            var multis = [];
			while( m < tamanho-1 ) {
				for (i = m + 1; i < tamanho; i++) {
					var multiplicador = valores[i][m] / valores[m][m];
                    multis[k] = multiplicador;
                    k++;
					for (var j = 0; j < valores[i].length; j++) {
						var r = valores[i][j] - (multiplicador * valores[m][j]);
						valores[i][j] = r;
					}
				}
				m++;
				criarTabela(valores,m);
				if(m==tamanho-1){
					calculoLouco(valores);
				}
			}

			function criarTabela(valores,m){
				var tabela = "<table class='tabelinha'>";
				tabela += "<caption>K = "+(m)+"</caption>";
				for(i = 0; i < valores.length; i++){
					tabela += "<tr>";
					for(j = 0; j < valores[i].length; j++){
						if(j==(valores[i].length-1)){
							tabela += "<td class='naomexa'></td>";
						}
						tabela += "<td class='celula'>";
						tabela += "<input type='text' value='"+valores[i][j]+"' disabled>";
						tabela += "</td>";
					}
					tabela += "</tr>";
				}
				tabela += "</table>";
				$('.inicioRespostas').append(tabela);
			}
            matrizL(multis);
            matrizU(valores);
		});

	});


	function calculoLouco(matriz){
		
		matriz.splice(0,matriz.size-1);
		
		var arr1 = Create2DArray(tamanho);
		
		var arr2 = Create2DArray(tamanho);
		
		for(var i=0;i<tamanho;i++){
			for(var j=0;j<tamanho;j++){
				arr1[i][j]=matriz[i][j];
			}	
		}
		
		for(var i=0;i<tamanho;i++){
			arr2[i] = matriz[i][tamanho];
		}	

		var resp = Create2DArray(tamanho);
		
		for (var i = arr1.length - 1; i >= 0; i--) {
            var j = i + 1;
            while (j < arr1.length) {
                arr1[i][j] = arr1[i][j] * resp[j];
                j++;
            }
            j = i + 1;
            var calc = 0;
            while (j < arr1.length) {
                calc += arr1[i][j];
                j++;
            }
            resp[i] = (arr2[i] - calc) / arr1[i][i];
        }
		
//		var solucao = "";
//		
//		for (var i = 0; i < resp.length; i++) {
//            solucao += "X"+i+"= "+resp[i]+"  | ";
//        }
		matrizB(resp);
	}

	function Create2DArray(rows) {
		var arr = [];

		for (var i=0;i<rows;i++) {
			arr[i] = [];
		}
		return arr;
	}
    
    function matrizL(matriz){
        var dado = 0;
        
        var tabela = "<table class='tabelinha'>";
        tabela += "<caption>Matriz L</caption>";
        for(i = 0; i < tamanho; i++){
            tabela += "<tr>";
            for(j = 0; j < tamanho; j++){
                if(j>i){
                    tabela += "<td class='celula'>";
                    tabela += "<input type='text' value='"+matriz[dado]+"' disabled>";
                    tabela += "</td>";
                    dado++;
                }else if(j==i){
                    tabela += "<td class='celula'>";
                    tabela += "<input type='text' value='1' disabled>";
                    tabela += "</td>";
                }else{
                    tabela += "<td class='celula'>";
                    tabela += "<input type='text' value='0' disabled>";
                    tabela += "</td>";
                }
            }
            tabela += "</tr>";
        }
        tabela += "</table>";
        $('.matrizL').html('');
        $('.matrizL').append(tabela);
        $(".matrizL .tabelinha").each(function() {
            var $this = $(this);
            var newrows = [];
            $this.find("tr").each(function(){
                var i = 0;
                $(this).find("td").each(function(){
                    i++;
                    if(newrows[i] === undefined) { newrows[i] = $("<tr></tr>"); }
                    newrows[i].append($(this));
                });
            });
            $this.find("tr").remove();
            $.each(newrows, function(){
                $this.append(this);
            });
        });
    }
    
    function matrizU(matriz){
        var dado = 0;
        
        var tabela = "<table class='tabelinha'>";
        tabela += "<caption>Matriz U</caption>";
        for(i = 0; i < tamanho; i++){
            tabela += "<tr>";
            for(j = 0; j < tamanho; j++){
                if(j>i||j==i){
                    tabela += "<td class='celula'>";
                    tabela += "<input type='text' value='"+matriz[i][j]+"' disabled>";
                    tabela += "</td>";
                    dado++;
                }else{
                    tabela += "<td class='celula'>";
                    tabela += "<input type='text' value='0' disabled>";
                    tabela += "</td>";
                }
            }
            tabela += "</tr>";
        }
        tabela += "</table>";
        $('.matrizU').html('');
        $('.matrizU').append(tabela);
    }
    
    function matrizB(matriz){
        console.log(matriz);
        var tabela = "<table class='tabelinha'>";
        tabela += "<caption>Matriz B</caption>";
        for(i = 0; i < matriz.length; i++){
            tabela += "<tr>";
            tabela += "<td class='celula'>";
            tabela += "<input type='text' value='"+matriz[i]+"' disabled>";
            tabela += "</td>";
            tabela += "</tr>";
        }
        tabela += "</table>";
        $('.matrizB').html('');
        $('.matrizB').append(tabela);
    }


});