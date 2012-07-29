/* Author: Yuya Takeyama

*/
; (function (window, document, undefined) {
  // ViewModel of #output_area
  var OutputArea = function ($outputArea) {
    this.$ = $outputArea;
  };
  (function (o) {
    o.prototype.print = function (text) {
      this.$.append(text);
    };

    o.prototype.puts = function (text) {
      this.print(text + "<br>");
    };

    o.prototype.clear = function () {
      this.$.text('');
    };
  })(OutputArea);

  // Output Formatters
  var AbstractFormatter = function (output) {
    this.output = output;
  };
  (function (o) {
    o.print = function (text) {
      this.output.print(text);
    };

    o.puts = function (text) {
      this.output.puts(text);
    };
  })(AbstractFormatter.prototype);

  var OnlyUrlFormatter = function (output) {
    this.output = output;
  };
  OnlyUrlFormatter.prototype = new AbstractFormatter;
  (function (o, a) {
    o.onFileGiven = function (file, uri) {
      this.puts(uri);
    };
  })(OnlyUrlFormatter.prototype);

  // Entry point
  window.jQuery(document).ready(function () {
    var $          = window.jQuery
      , outputArea = new OutputArea($('#output_area'))
      , $ddBox     = $('#dd_box')
      , formatter  = new OnlyUrlFormatter(outputArea)
      , forEach    = Array.prototype.forEach;

    $.event.props.push('dataTransfer');

    $ddBox.on('drop', function (event) {
      event.stopPropagation();
      event.preventDefault();
      outputArea.clear();

      var files = event.dataTransfer.files;
      forEach.call(files, function (file, i) {
        var reader = new window.FileReader;
        reader.onload = function (event) {
          formatter.onFileGiven(file, event.srcElement.result);
        };
        reader.readAsDataURL(file)
      });

      $ddBox.removeClass('dragging');
    });

    $ddBox.on('dragenter', function () {
      $ddBox.addClass('dragging');
    });

    $ddBox.on('dragleave', function () {
      $ddBox.removeClass('dragging');
    });
  });
})(window, document, undefined);
