import FormStorage from 'form-storage';
import $ from 'jquery';

import html from './index.html';
import style from './style.css';

const notice = ($formChecker, message) => {
  const $notice = $(`<div class='formChecker_notice'>${message}</div>`);
  $formChecker.append($notice);
  $notice.delay(1).queue(function (next) {
    $(this).addClass("active");
    next();
  }).delay(700).queue(function (next) {
    $(this).removeClass('active');
    next();
  }).delay(200).queue(function (next) {
    $(this).remove();
    next();
  });
}

const initMyBookmarklet = () => {
  const $formChecker = $("<div class='formChecker'></div>");
  $formChecker.append(html);
  $formChecker.append(`<style>${style}</style>`);
  $("body").append($formChecker);
  $(document).on("click", ".formChecker", (e) => {
    if ($(e.target).hasClass('formChecker')) {
      $formChecker.remove();
    }
  });
  $(document).on("click", ".formCheckerSave", (e) => {
    const pathname = location.pathname;
    const selector = $(".formChecker_input").val();
    const key = `${selector}${pathname}`;
    const formStorage = new FormStorage(selector, {
      name: key
    });
    formStorage.save();
    notice($formChecker, "The data is saved in the localstorage")
  });
  $(document).on("click", ".formCheckerAuto", (e) => {
    const pathname = location.pathname;
    const selector = $(".formChecker_input").val();
    const key = `${selector}${pathname}`;
    const formStorage = new FormStorage(selector, {
      name: key
    });
    formStorage.apply();
    notice($formChecker, "The data is loaded from the localstorage")
  });
}

initMyBookmarklet();