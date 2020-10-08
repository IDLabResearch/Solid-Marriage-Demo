import { jsPDF } from "jspdf";
import background from "../assets/background2.png"
import "../assets/PalatinoBold-bold"
import { getVal } from "../singletons/QueryEngine";

const blobStream = require('blob-stream');

const nameIndent = 60;
const leftIndent = 30;

export async function generateCertificatePDF (proposal, certificate) {
  let currentY = 0

  const getPersonData = async (id) => { return({ id, name: await getVal(id, 'name') }) }


  let spouses = await Promise.all(proposal.spouse.map(async (e) => await getPersonData(e.id)))
  if(spouses.length === 1) spouses = [spouses[0], spouses[0]]
  const witnesses = await Promise.all(proposal.witness.map(async (e) => await getPersonData(e.id)))
  if(spouses.length !== 2 && spouses.length !== 1) throw new Error('incorrect number of spouses')
  const official = await getPersonData(certificate.certified_by)
  const weddingDate = new Date(certificate.certification_date)

  

  // Default export is a4 paper, portrait, using millimeters for units
  const doc = new jsPDF();

  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  
  doc.setFont('PalatinoBold', 'bold');
  
  doc.addImage(background, 'png', 0,0, width, height);


  doc.setFontSize(40)
  // Bug in jspdf, url link is not transformed correctly with align: 'center'
  // doc.textWithLink('Marriage Certificate', (width / 2) , currentY+=40, {align: 'center', url: certificate.id});
  doc.textWithLink('Marriage Certificate', 40, currentY+=40, {url: certificate.id});


  doc.setFontSize(20)

  doc.text("This document certifies the marriage between", leftIndent , currentY+=20, "left");
  doc.text("both", leftIndent , currentY+=20, "left");
  doc.textWithLink(`${spouses[0].name}`, nameIndent , currentY+=0, {url: spouses[0].id});
  doc.text("and", leftIndent , currentY+=15, "left");
  doc.textWithLink(`${spouses[1].name}`, nameIndent , currentY+=0, {url: spouses[1].id});


  doc.text(`on ${weddingDate.toDateString()} at ${weddingDate.toLocaleTimeString()}`, leftIndent , currentY+=25, "left");
  
  doc.text('by', leftIndent , currentY+=15, "left");
  doc.textWithLink(`${official.name}`, nameIndent , currentY+=0, {url: official.id});

  doc.text('Witnessed by', leftIndent , currentY+=25, "left");
  
  for (const [index, witness] of witnesses.entries()) {
    const increase = index === 0 ? 15 : 10
    doc.textWithLink(`${witness.name}`, nameIndent , currentY+=increase, {url: witness.id});
  }


  const blobPDF = new Blob([doc.output('blob')], { type: 'application/pdf' } )
  const url = URL.createObjectURL(blobPDF)
  window.open(url)

}

