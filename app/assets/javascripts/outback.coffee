# ### Outback: servicing job seekers in remote communities
#
# Outback currently supports the following:
# 
# * authentication with Bridge
# * syncing the caseload
# * displaying contact details while offline
# * syncing the contacts
#
# Planned features:
#
# * viewing the client history while offline
# * viewing the referral data
# * viewing placement data
# * viewing attachments
# * secure storage on the local machine
# * viewing appointments in local calendar app
#
# Current Issues
#
# * handling errors during sync
# * refactor syncing events
# * pressing the cancel button at any time during sync
# * store bridge credentials locally? - no force everytime
# * reformat last sync
#   * show last successful and possible last unsuccessful sync
# * break js up in classes + namespace
# * sync class
#   * manages the model side and emits events?
#   * stores the current state of they sync in localstore
#   * aborts ajax
# * move templates 

# Load the clients from localstore and start the app
$(document).ready ->
  # jQuery mobile doesn't really handle deep linking too well
  if window.location.href.match(/#/)
    window.location = window.location.href.replace(/#.*/, '')
  else
    $.mobile.pageLoading()
    $(window.applicationCache).bind 'updateready', ->
      window.applicationCache.swapCache()
      window.location.reload()
    $(window.applicationCache).bind 'cached noupdate error obsolete', ->
      $.mobile.pageLoading(true)
      Clients.fetch success: ->
        Backbone.history.start()
        outbackController.home()
