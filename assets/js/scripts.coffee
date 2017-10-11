$ ->
  $('.section-link').on 'click', (e) ->
    link = $(@).find("a").first().attr('href')
    window.location = link
