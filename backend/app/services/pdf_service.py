import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from backend.app.models.invoice import Invoice
from backend.app.models.settings import SystemSettings

def generate_invoice_pdf(invoice: Invoice, settings: SystemSettings) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom modern styles
    primary_color = colors.HexColor("#4338ca")
    slate_dark = colors.HexColor("#0b1c30")
    slate_muted = colors.HexColor("#565e74")
    border_color = colors.HexColor("#e2e8f0")
    light_bg = colors.HexColor("#f8f9ff")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=slate_muted,
    )

    section_header = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=primary_color,
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=slate_dark,
    )

    cell_regular = ParagraphStyle(
        'CellRegular',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=slate_dark,
    )

    cell_muted = ParagraphStyle(
        'CellMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=slate_muted,
    )

    story = []

    # 1. Header Table: Store Info on Left, Invoice Details on Right
    store_info_text = f"""
    <b><font size="14" color="#4338ca">{settings.store_name}</font></b><br/>
    <font size="9" color="#565e74">{settings.branch_name}</font><br/>
    <font size="8" color="#565e74">{settings.address}</font><br/>
    <font size="8" color="#565e74">GSTIN: {settings.gstin} | Phone: {settings.phone}</font>
    """

    invoice_meta_text = f"""
    <b><font size="13" color="#0b1c30">{settings.bill_header}</font></b><br/>
    <b>Invoice No:</b> <font color="#4338ca"><b>{invoice.invoice_number}</b></font><br/>
    <b>Date:</b> {invoice.created_at.strftime('%d-%b-%Y %I:%M %p')}<br/>
    <b>Payment Mode:</b> {invoice.payment_mode} ({invoice.payment_status})
    """

    header_table = Table(
        [
            [Paragraph(store_info_text, styles['Normal']), Paragraph(invoice_meta_text, styles['Normal'])]
        ],
        colWidths=[320, 200]
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1, color=border_color, spaceBefore=4, spaceAfter=12))

    # 2. Bill To / Customer Details
    customer_info_text = f"""
    <b>Billed To:</b><br/>
    <font size="10" color="#0b1c30"><b>{invoice.customer_name}</b></font><br/>
    <font size="8" color="#565e74">Phone: {invoice.customer_phone or 'N/A'}</font>
    """
    if invoice.shop:
        customer_info_text += f"<br/><font size=\"8\" color=\"#565e74\">Shop: {invoice.shop.name} (GSTIN: {invoice.shop.gstin or 'N/A'})</font>"

    cust_table = Table([[Paragraph(customer_info_text, styles['Normal'])]], colWidths=[520])
    cust_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cust_table)
    story.append(Spacer(1, 14))

    # 3. Line Items Table
    # Columns: # | SKU & Product | Pack | Qty | Rate | Disc | Tax | Total
    table_data = [
        [
            Paragraph("<b>#</b>", cell_bold),
            Paragraph("<b>Item Description & SKU</b>", cell_bold),
            Paragraph("<b>Pack</b>", cell_bold),
            Paragraph("<b>Qty</b>", cell_bold),
            Paragraph("<b>Rate (₹)</b>", cell_bold),
            Paragraph("<b>Disc</b>", cell_bold),
            Paragraph("<b>Tax %</b>", cell_bold),
            Paragraph("<b>Total (₹)</b>", cell_bold),
        ]
    ]

    for idx, item in enumerate(invoice.items, start=1):
        item_title = f"<b>{item.product_name}</b><br/><font color='#565e74' size='7'>{item.sku}</font>"
        table_data.append([
            Paragraph(str(idx), cell_regular),
            Paragraph(item_title, cell_regular),
            Paragraph(item.pack_size or "1 unit", cell_regular),
            Paragraph(f"{item.quantity:.1f} {item.unit}", cell_regular),
            Paragraph(f"{item.unit_rate:.2f}", cell_regular),
            Paragraph(f"{item.discount_amount:.2f}", cell_regular),
            Paragraph(f"{item.tax_rate:.1f}%", cell_regular),
            Paragraph(f"{item.total_amount:.2f}", cell_bold),
        ])

    items_table = Table(table_data, colWidths=[25, 175, 55, 55, 60, 45, 45, 60])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), light_bg),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 14))

    # 4. Totals & Payment Summary
    totals_data = [
        [Paragraph("<b>Subtotal:</b>", cell_regular), Paragraph(f"₹ {invoice.subtotal:,.2f}", cell_bold)],
        [Paragraph("<b>Discount:</b>", cell_regular), Paragraph(f"- ₹ {invoice.discount_amount:,.2f}", cell_regular)],
        [Paragraph("<b>GST / Tax:</b>", cell_regular), Paragraph(f"+ ₹ {invoice.tax_amount:,.2f}", cell_regular)],
        [Paragraph("<b>Grand Total:</b>", cell_bold), Paragraph(f"<b><font size='11' color='#4338ca'>₹ {invoice.total_amount:,.2f}</font></b>", cell_bold)],
        [Paragraph("<b>Amount Paid:</b>", cell_regular), Paragraph(f"₹ {invoice.paid_amount:,.2f}", cell_regular)],
        [Paragraph("<b>Balance Due:</b>", cell_bold), Paragraph(f"₹ {invoice.balance_amount:,.2f}", cell_bold)],
    ]
    totals_table = Table(totals_data, colWidths=[120, 100])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LINEBELOW', (0,3), (1,3), 1, primary_color),
    ]))

    summary_container = Table(
        [
            [
                Paragraph(f"<b>Payment Mode:</b> {invoice.payment_mode}<br/><b>Status:</b> {invoice.payment_status}<br/><b>UPI ID:</b> {settings.upi_id}", cell_muted),
                totals_table
            ]
        ],
        colWidths=[300, 220]
    )
    summary_container.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(summary_container)
    story.append(Spacer(1, 16))

    # 5. Terms & Footer
    terms_text = f"<b>Terms & Conditions:</b><br/>{settings.terms_and_conditions.replace(chr(10), '<br/>')}"
    story.append(Paragraph(terms_text, cell_muted))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph(f"<font color='#565e74' size='8'>{settings.bill_footer}</font>", ParagraphStyle('Footer', parent=styles['Normal'], alignment=1)))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
