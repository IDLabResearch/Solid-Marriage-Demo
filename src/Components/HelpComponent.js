import React from 'react'


const HelpComponent = (props) => {
  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4> About this Demo </h4>
      <br />
      This screen will provide information on how the steps for this demo, and how they can be performed (with images preferably)
      I also would like to make this not a single page app, so I can link people to the help page (or even make this the landing screen)
      But I have not yet worked with the routing options for react, but that would be a nice to have
      <br />

      TODOs:
      inmplement deleting mariage proposal
      Complete help component
      resend notification on pending
      Remove notifications from bar
      Highlight hovered notification
      add witness encrypted accept (with private key) to marriage proposal.
      have official sign entire proposal.
      create a (signed) certification of the marriage stored on the pod of the official (= pod of the state)
      return link to (signed) certificate

      add link to certification in proposal
      show certificate in viewer

      Give marriage proposals a demo:MarriageProposal type that we can filter the announcements.

      update civil status on accepted
      fix this also happens for the other person?
      make contract viewable for all actors involved

      Only load notifications that were not load last time

      Used vocabularies?
      Default storage locations? solid file client to create folders?

      Do the digital signatures?

      Handle Errors

      set status to married

      fix default pending in official evaluation to not loaded or sth (and maybe also on other places, certainty through N3 use instead of ldflex)

      Unify internal naming scheme: Marriage proposal - certified proposal? ...

      set all created data to a specific name and provide delete button at the end to remove all demo data (except for name?) so that if people use their real data pod it wont get that messy?

      SET LEFT BAR SELECTED ITEM HIGHLIGHT

      set other key items in lists in case of duplicate subjects

      code comments

      convert large components - save additional logic in a controller file?
    </div>
  )
}

export default HelpComponent
