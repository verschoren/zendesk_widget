$(document).ready(function(){
    $('#calculator').change(function(){
        calculate();
    });
    
    function calculate(){
        var total_data_storage = $('#total_data_storage').val() ? $('#total_data_storage').val()*1024*1024 : 0; //in kb
        var total_file_storage = $('#total_file_storage').val() ? $('#total_file_storage').val()*1024*1024 : 0; //in kb
        var total_tickets = $('#total_tickets').val() ? $('#total_tickets').val() : 0;
        
        //calculate average storage
        var average_file_storage = total_tickets > 0 ? total_file_storage / total_tickets : 'N/A';
        var average_data_storage = total_tickets > 0 ? total_data_storage / total_tickets : 'N/A';
        
        if (average_file_storage == 'N/A'){
            $('#average_file_storage').html('N/A');
            $('#average_data_storage').html('N/A');
        } else {
            calculateResult('file',average_file_storage);
            calculateResult('data',average_data_storage);
            calculateResultTickets(average_file_storage,average_data_storage);
        }
    }
    
    function calculateResult(type,average){
        var formatted = formatBytes(average);
        $('#average_'+type+'_storage').html(`
            <span>${formatted[0]}</span>
            <span class="ml-2 text-sm text-licorice">${formatted[1]} per ticket</span>
        `);    
        
        //calculate goal tickets
        var goal_tickets = $('#goal_tickets').val() ? $('#goal_tickets').val() : 0;
        var result = goal_tickets * average;
        var result_formatted = formatBytes(result);
        $('#result_'+type+'_gb').html(`
            <span class="text-sm text-licorice">You saved &nbsp;</span>
            <span>${result_formatted[0]}</span>
            <span class="ml-2 text-sm text-licorice">${result_formatted[1]} of ${type} Storage</span>
        `); 
    }

    function formatBytes(input){
        if (input >= 1024 * 1024){
            return [(input / 1024 / 1024).toFixed(1), 'GB'];
        } else if (input >= 1024){
            return [(input / 1024).toFixed(1), 'MB'];
        }
        return [input.toFixed(1), 'KB'];
    }

    function formatInteger(input){
        //add . to every 3 digits
        var result = '';
        var count = 0;
        for (var i = input.length - 1; i >= 0; i--){
            if (count == 3){
                result = '.' + result;
                count = 0;
            }
            result = input[i] + result;
            count++;
        }
        return result;
    }

    function calculateResultTickets(average_file_storage,average_data_storage){
        //calculate goal data
        var goal_data = $('#goal_data').val() ? $('#goal_data').val() * 1024 * 1024 : 0;
        var result_tickets = goal_data / average_file_storage;
        var result_data_tickets = formatBytes(result_tickets*average_data_storage);
        $('#result_tickets').html(`
            <span class="text-sm text-licorice">You need to delete&nbsp;</span>
            <span>${formatInteger(result_tickets.toFixed(0))}</span>
            <span class="ml-2 text-sm text-licorice">tickets</span>
        `);
        $('#result_data_tickets').html(`
           This also removes ${result_data_tickets[0]}${result_data_tickets[1]} of Data Storage
        `);
    }
});