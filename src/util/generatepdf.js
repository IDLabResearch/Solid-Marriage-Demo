
// const PDFDocument = require('@react-pdf/pdfkit');
import PDFDocument from '@react-pdf/pdfkit'

const blobStream = require('blob-stream');

const { default: data } = require('@solid/query-ldflex');
 

export async function generateCertificatePDF (proposal, certificate) {

  const getPersonData = async (id) => { return ( {id: id, name: await data[id].name} ) }

  console.log('proposal', proposal)
  console.log(proposal.spouse)
  console.log(proposal.witness)
  console.log('certificate', certificate)
  console.log(certificate.certified_by)

  const spouses = await Promise.all(proposal.spouse.map(async (e) => await getPersonData(e)))
  const witnesses = await Promise.all(proposal.witness.map(async (e) => await getPersonData(e)))
  if(spouses.length !== 2 && spouses.length !== 1) throw new Error('incorrect number of spouses')
  const official = await getPersonData(certificate.certified_by)
  const weddingDate = certificate.certification_date

  // Create a document
  const doc = new PDFDocument();
  // pipe the document to a blob
  const stream = doc.pipe(blobStream());

  // doc.image('../assets/background2.png', 0,0, {width: doc.page.width, height: doc.page.height})

  
  // doc.font('../assets/PalatinoBold.ttf')

  console.log('DOC', doc)

  doc.fontSize(40);
  doc
    .text(`Marriage Certificate`, {
      align: 'center',
    });


  doc.moveDown(1.5)


  doc.fontSize(20);
  doc
  .text(`This document certifies the marriage between`, { });

  doc.moveDown(2)

  doc.fontSize(20);
  doc.text(`both`, {
    indent: 0,
  });
  doc.moveUp()
  doc.text(`${spouses[0].name}`, {
    indent: 75,
    link: spouses[0].id,
  });


  doc.text(`and`, {
    indent: 0,
  });
  doc.moveUp()
  doc.text(`${spouses[1] ? spouses[1].name : spouses[0].name}`, {
    indent: 75,
    link: spouses[1] ? spouses[1].id : spouses[0].id,
  });


  doc.moveDown(1.3)


  doc.text(`on ${weddingDate.toDateString()} at ${weddingDate.toLocaleTimeString()}`, { });

  doc.moveDown(1)

  doc.text(`by ${official.name}`, {
    link: official.id
  });

  // doc.text(`with the function of ${certifiedPerson.fct}`, {
  //   link: certifiedPerson.webid
  // });
  // doc.moveDown(1)

  // doc.text(`at ${weddingLocation}`, { });

  doc.moveDown(2)
  doc.text(`Witnessed by`, {});

  doc.moveDown(1)
  
  for (const witness of witnesses) {
    doc.text(`${witness.name}`, {
      indent: 75,
      link: witness.id,
    });
    doc.moveDown(0.5)
  }

  doc.end();


  stream.on('finish', function() {
    // get a blob you can do whatever you like with
    const blob = stream.toBlob('application/pdf');
  
    // or get a blob URL for display in the browser
    const url = stream.toBlobURL('application/pdf');
    // iframe.src = url
    console.log(url)
    window.open(url)
  });

}


// // require dependencies
// const PDFDocument = require('pdfkit');
 
// // create a document the same way as above
// const doc = new PDFDocument();
 
// // pipe the document to a blob
// const stream = doc.pipe(blobStream());
 
// // add your content to the document here, as usual
 
// // get a blob when you're done
// doc.end();
// stream.on('finish', function() {
//   // get a blob you can do whatever you like with
//   const blob = stream.toBlob('application/pdf');
 
//   // or get a blob URL for display in the browser
//   const url = stream.toBlobURL('application/pdf');
//   iframe.src = url;
// });