var onLoadCallback = (function() {
  function enableDialogs() {
    $('.dialog').dialog({
      autoOpen: false,
      buttons: {
        Create: submitForm,
        Cancel: function() { $(this).dialog('close') }
      }
    }).each(function() {
      var d = $(this);
      d.dialog('option', 'title', d.attr('data-dialog-title')).
      dialog('option', 'height', d.attr('data-dialog-height')).
      dialog('option', 'width', d.attr('data-dialog-width')).
      dialog('option', 'modal', d.hasClass('modal'));
    });

    $('.dialog-switch').click(function(event) {
      event.preventDefault();
      $('#' + $(this).attr('data-dialog')).dialog('open');
      return false;
    });
  }

  function submitForm() {
    $(this).find('form').submit()
  }

  function _handleFormSubmit(form, options) {
    form.submit(function(event) {
      event.preventDefault();
      $.ajax({
        type: 'POST',
        url: this.action + '.json',
        dataType: 'json',
        data: $(this).serialize(),
        success: options.onSuccess,
        error: ( options.onError || function(req, text) { alert(errorMsg(req)) } )
      });
      return false;
    });
  }

  // TODO this can be a global function
  function errorMsg(req) {
    try {
      // error format: [['field_name#1', 'error message#1'], ... , ['field_name#N', 'error message#N']]
      var error = eval('(' + req.responseText + ')');
    } catch(e) {
      var error = []
    }
    var msg = [];
    $.each(error, function() {
      msg.push(this.join(' '))
    });
    return msg.join("\n");
  }

  function handleFormSubmit() {
    _handleFormSubmit($('#profile-form').find('form'), {
      onSuccess: function(data) {
        $('p.notice').remove();
        addProfile(data.profile);
        $('#profile-form').dialog('close');
      }
    });

    _handleFormSubmit($('#feedback-form').find('form'), {
      onSuccess: function(data) {
        changeProfileEvent(data);
        $('#feedback-form').dialog('close');
      },
      onError: function(req, text) { alert("Sorry, operation failed. Please try it later.") }
    });
  }

  function addProfile(object) {
    var tr = $('<tr/>');
    $('<td/>').text(object.name).appendTo(tr);
    $('<td/>').text(object.state).appendTo(tr);
    tr.appendTo($('#profile-table').find('tbody'));
  }

  function setupTable() {
    $('tbody tr').live('hover',
        function() { $(this).addClass('hover') },
        function() { $(this).removeClass('hover') }
    );

    $('#profile-table .event').live('click', function(event) {
      event.preventDefault();
      $('#feedback-form').find('form').attr('action', this.href).end().dialog('open');
      return false;
    });
  }

  function changeProfileEvent(data) {
    data = data.profile;
    var ul = $('#profile-' + data.id).children('td').
      eq(1).text(data.state).end().
      eq(2).children('ul');
    ul.children().remove();
    $.each(data.events, function() {
      $('<a/>').addClass('event').attr('href', this.url).
        text(this.name).appendTo(
          $('<li/>').appendTo(ul)
        );
    });
  }

  return function() {
    enableDialogs();
    handleFormSubmit();
    setupTable();
  }
})();
