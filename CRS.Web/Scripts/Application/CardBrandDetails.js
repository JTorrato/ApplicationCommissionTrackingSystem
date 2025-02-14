﻿var viewModel = function () {
    var self = this;
    var modes = { Add: 0, Edit: 1, View: 2 };
    var cardBrandCodeData = undefined;
    var channelCodeData = undefined;

    $('body').on('show', '.modal', function () {
        $(this).css({ 'width': '500px', 'margin-top': ($(window).height() - $(this).height()) / 2, 'top': '0' });
    });

    self.items = ko.observableArray();
    self.mode = ko.observable(modes.View);
    self.itemColumns = ['ChannelName', 'CardBrandCode', 'CommissionRate'];

    self.isEditMode = ko.computed(function () {
        return self.mode() == modes.Edit;
    });
    self.isAddMode = ko.computed(function () {
        return self.mode() == modes.Add;
    });

    self.title = ko.computed(function () {
        return self.isEditMode() ? 'Edit Card Brand Details' : 'Add Card Brand Details';
    });

    self.id = ko.observable();
    self.selectedCardBrand = ko.observable();
    self.cardBrandList = ko.observableArray();

    self.channelList = ko.observableArray();
    self.selectedChannel = ko.observable();
    self.strMessage = ko.observable();

    self.commissionRate = ko.observable().extend({
        required: { message: 'Rate is required.' },
        validation: {
            message: 'Card Brand and Channel already exist.',
            validator: function (val) {
                if ((cardBrandCodeData == self.selectedCardBrand() && channelCodeData == self.selectedChannel()) &&
                        (self.isEditMode())) {
                    return true;
                }
                var result = false;
                exec({
                    url: '/CardBrandDetails/IsCardBrandDetailsExist',
                    type: 'GET',
                    data: {
                        cardBrandCode: self.selectedCardBrand(),
                        channelCode: self.selectedChannel()
                    }
                }, function (data) {
                    result = data;
                }, false);

                return result;
            }
        }
    });
   
    function exec(options, callback, parseToJson, blockUI) {
        options.async = false;
        options.dataType = 'json';
        options.contentType = 'application/json; charset=utf-8';
        options.beforeSend = (blockUI || blockUI == undefined) ?
            $.blockUI({ message: '<h4><img src="../Content/images/ajax-loader.gif" /><br/> Just a moment...</h4>' }) : undefined;
        options.data = (parseToJson || parseToJson == undefined) ? JSON.stringify(options.data) : options.data;
        $.ajax(options).done(callback).always(function () {
            $.unblockUI();
        });
    };

    //--Get items (begin) ---------------------------------------------------------//
    function getItems() {
        $.ajax({
            url: '/CardBrandDetails/GetCardBrandDetailsList',
            type: 'GET',
            data: {},
            beforeSend: function () {
                $.blockUI({ baseZ: 2000, message: '<h4><img src="../Content/images/ajax-loader.gif" /><br/> Just a moment...</h4>' });
            },
            complete: function () {
                $.unblockUI();
            },
            success: function (data) {
                var mappedData = $.map(data, function (item) {
                    return result = {
                        Id: item.ID,
                        CardBrandCode: item.CardBrandCode,
                        CardBrandName: item.CardBrandName,
                        ChannelCode: item.ChannelCode,
                        ChannelName: item.ChannelName,
                        CommissionRate: item.CommissionRate > 0 ? formatCurrency(new Number(item.CommissionRate).toFixed(2)) : '',
                    }
                });
                self.items(mappedData);
            },
            error: function () {
                $.unblockUI();
            }
        });
    };
    //--Get items (end) ---------------------------------------------------------//

    function setFormData(data) {
        var isEditMode = self.isEditMode();
        cardBrandCodeData = isEditMode ? data.CardBrandCode : undefined;
        channelCodeData = isEditMode ? data.ChannelCode : undefined;
        self.id(isEditMode ? data.Id : undefined);
        self.selectedCardBrand(cardBrandCodeData);
        self.selectedChannel(channelCodeData);
        self.commissionRate(isEditMode ? data.CommissionRate : undefined);
    }

    self.add = function () {
        self.mode(modes.Add);
        setFormData({});
        self.unvalidate();
    }

    self.edit = function (data) {
        self.mode(modes.Edit);
        setFormData(data);
    }

    self.deleteCardBrandDetails = function () {
        $.ajax({
            url: '/CardBrandDetails/DeleteCardBrandDetails',
            type: 'DELETE',
            data: {
                cardBrandDetailsId: self.id()
            },
            beforeSend: function () {
                $.blockUI({ baseZ: 2000, message: '<h4><img src="../Content/images/ajax-loader.gif" /><br/> Just a moment...</h4>' });
            },
            complete: function () {
                $.unblockUI();
            },
            success: function (data) {
                getItems();
                $('#confirmDeleteModal').modal('hide');
            },
            error: function () {
                $.ambiance({
                    message: 'Error encountered',
                    type: "error",
                    title: "Error Notification!",
                    fade: false
                });
                $.unblockUI();
            }
        });
    }

    self.isValid = ko.computed(function () {
        return self.commissionRate.isValid();
    
    });

    self.setId = function (data) {
        self.id(data.Id);
    }

    self.save = function () {
        self.validate();
        var isValid = isWhitespaceNotEmpty(self.strMessage());

        if (self.isValid() && isValid) {
            var options = {
                url: '/CardBrandDetails/SaveCardBrandDetails',
                type: 'POST',
                data: {
                    CardBrandCode: self.selectedCardBrand(),
                    ChannelCode: self.selectedChannel(),
                    CommissionRate: self.commissionRate()
                }
            }

            if (self.isEditMode()) {
                options.url = '/CardBrandDetails/UpdateCardBrandDetails';
                options.type = 'PUT';
                options.data.Id = self.id();
            }

            $.ajax({
                url: options.url,
                type: options.type,
                data: options.data,
                beforeSend: function () {
                    $.blockUI({ baseZ: 2000, message: '<h4><img src="../Content/images/ajax-loader.gif" /><br/> Just a moment...</h4>' });
                },
                complete: function () {
                    $.unblockUI();
                },
                success: function (data) {
                    getItems();
                    $('#cardBrandDetailsModal').modal('hide');
                },
                error: function () {
                    alert('Error encountered');
                    $.unblockUI();
                }
            });
        } else {
            var str = self.strMessage();
            if (!isWhitespaceNotEmpty(str)) {
                $.ambiance({
                    message: str,
                    type: "error",
                    title: "Error Notification!",
                    fade: false
                });
            }
            return false;
        }
    };

    self.unvalidate = function () {
        self.commissionRate.clearError();
    }

    self.validate = function () {
        self.commissionRate.valueHasMutated();
    }

    getItems();
    getChannels();
    getCardBrands();


    //------------ get Channel List ------
    function getChannels() {
        var param = {
            url: '/ChannelTarget/GetChannelList',
            type: 'GET',
            data: {}
        };

        bt.ajax.exec(param, function (data) {
            self.channelList(data);
        });
    };
    //------------------------- end

    //------------ get CardBrand List ------
    function getCardBrands() {
        var param = {
            url: '/CardType/GetCardBrandList',
            type: 'GET',
            data: {}
        };

        bt.ajax.exec(param, function (data) {
            self.cardBrandList(data);
        });
    };
    //------------------------- end
    //-- validate before saving
    $(':button').click(function () {
        var sText = $(this).text();
        var strMessage = '';
        if (sText == 'Save') {
            var cardBrand = self.selectedCardBrand();
            var channel = self.selectedChannel();
            if (typeof cardBrand == 'undefined' || cardBrand == '') {
                strMessage = strMessage + "Card Brand is required." + '<br/>';
            }
            if (typeof channel == 'undefined' || channel == '') {
                strMessage = strMessage + "Channel is required." + '<br/>';
            }
            self.strMessage(strMessage);
        }
    });
    //------------------------------------------ end
    //-- check if string if null, empty or whitespace
    var isWhitespaceNotEmpty = function (str) {
        return (!str || 0 === str.length) && (!str || /^\s*$/.test(str));
    }
    //---------------------------------- end
    function formatCurrency(value) {
        var result = '';
        var decimalPlace = value.substring(value.indexOf('.'));
        var valueLength = value.length - decimalPlace.length;
        for (ctr = valueLength - 1; ctr >= 0; ctr--) {
            result = value[ctr] + result;
            if (ctr != 0 && (valueLength - ctr) % 3 == 0) {
                result = ',' + result;
            }
        }
        return result + decimalPlace;
    }   
}

$(function () {
    ko.applyBindings(new viewModel());
    $('#txtCommissionRate').autoNumeric('init', { vMax: '9999999999' });
});