'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Lock, CreditCard, CheckCircle2, Truck, ShieldCheck, Mail, ArrowRight, Sparkles, Apple, Globe, Banknote, ChevronDown, Search } from 'lucide-react';
import { CartItem, Order } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  discountCode?: string;
  giftPackaging: boolean;
  onOrderSuccess: (order: Order) => void;
}

const COUNTRIES = [
  'Egypt', 'United Arab Emirates', 'Saudi Arabia', 'United States', 'United Kingdom',
  'Canada', 'France', 'Germany', 'Italy', 'Spain', 'Switzerland', 'Qatar',
  'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Australia', 'Japan',
  'Singapore', 'Sweden', 'Netherlands', 'Belgium', 'Austria', 'Denmark'
].sort();

export default function CheckoutModal({
  isOpen,
  onClose,
  items = [],
  discount = 0,
  discountCode,
  giftPackaging,
  onOrderSuccess
}: CheckoutModalProps) {
  // Step: 'form' | 'processing' | 'confirmed'
  const [step, setStep] = useState<'form' | 'processing' | 'confirmed'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Customer state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address state
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Country searchable dropdown state
  const [country, setCountry] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState<'express_courier' | 'standard'>('express_courier');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'cod'>('cod');

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const safeItems = Array.isArray(items) ? items : [];
  const subtotal = safeItems.reduce((sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1), 0);

  // Always charge shipping fee (45 EGP for express courier)
  const shippingFee = shippingMethod === 'express_courier' ? 45 : 0;

  const total = subtotal + shippingFee;

  const filteredCountries = COUNTRIES.filter(c =>
    (c || '').toLowerCase().includes((countrySearch || '').toLowerCase())
  );

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName || !email || !address || !city || !postalCode || !country || !phone) {
      setErrorMsg('Please complete all required shipping fields including country.');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExp || !cardCvc)) {
      setErrorMsg('Please complete your credit card details.');
      return;
    }

    setStep('processing');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { firstName, lastName, email, phone },
          shippingAddress: { address, apartment, city, state, postalCode, country },
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'Pending Cash' : 'Paid',
          items: safeItems,
          subtotal,
          discount,
          discountCode,
          shippingFee,
          shippingMethod,
          total: Math.round(total * 100) / 100,
          giftPackaging
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to authorize acquisition');
      }

      setCreatedOrder(data.order);
      setStep('confirmed');
      onOrderSuccess(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error');
      setStep('form');
    }
  };

  return (
    <div className="modal-backdrop" onClick={step === 'processing' ? undefined : onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: step === 'confirmed' ? 620 : 920, padding: 0 }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              DOUÈ's ATELIER CHECKOUT
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.12em', marginTop: 2 }}>
              {step === 'confirmed' ? 'ACQUISITION CONFIRMED' : 'COMPLETE YOUR ACQUISITION'}
            </h2>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="btn-icon" style={{ width: 36, height: 36 }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div style={{ padding: '80px 32px', textAlign: 'center' }}>
            <div
              style={{
                width: 60,
                height: 60,
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#ffffff',
                borderRadius: '50%',
                margin: '0 auto 24px auto',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.15em', marginBottom: 8 }}>
              SECURING ATELIER ALLOCATION...
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
              Authorizing secure gateway, assigning private vault serial numbers, and notifying atelier directors.
            </p>
          </div>
        )}

        {/* Confirmed State */}
        {step === 'confirmed' && createdOrder && (
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle2 size={32} color="#ffffff" />
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
              ORDER REFERENCE
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: '#ffffff', margin: '4px 0 16px 0', letterSpacing: '0.1em' }}>
              {createdOrder.orderNumber ?? 'N/A'}
            </div>

            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 480, margin: '0 auto 24px auto' }}>
              Thank you, <strong style={{ color: '#fff' }}>{createdOrder.customer?.firstName ?? 'Valued Customer'}</strong>. Your luxury acquisition has been securely logged into the Atelier registry.
            </p>

            {/* Email Notification Dispatch Status Box */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 4,
              padding: '16px 20px',
              textAlign: 'left',
              marginBottom: 28
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                <Mail size={16} />
                <span>NOTIFICATIONS DISPATCHED IMMEDIATELY</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                &bull; <strong>Admin Alert:</strong> Real-time high-value order email sent to store director.<br />
                &bull; <strong>Customer Receipt:</strong> Order confirmation & tracking link dispatched to <span style={{ color: '#fff' }}>{createdOrder.customer?.email ?? email}</span>.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={onClose}
                className="btn-luxury"
                style={{ fontSize: 11, padding: '12px 28px' }}
              >
                RETURN TO BOUTIQUE
              </button>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>

            {/* Left Column: Customer & Shipping */}
            <div style={{ padding: '28px 32px', borderRight: '1px solid var(--border-subtle)' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em' }}>
                  1. CLIENT INFORMATION
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>FIRST NAME *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>LAST NAME *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>EMAIL (FOR RECEIPT) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PHONE NUMBER *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 ..."
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', marginBottom: 16 }}>
                2. DESTINATION ADDRESS
              </h3>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STREET ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name and number"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SUITE / APARTMENT</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Apt, Suite, Unit (optional)"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>AREA *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>GOVERNATE *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>POSTAL CODE *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Searchable Country Dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>COUNTRY *</label>
                <div
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 4,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: country ? 'var(--text-primary)' : 'var(--text-dim)',
                    fontSize: 13
                  }}
                >
                  <span>{country || 'Select country...'}</span>
                  <ChevronDown size={16} color="var(--text-muted)" style={{ transform: isCountryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>

                {isCountryOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    zIndex: 50,
                    maxHeight: 220,
                    overflowY: 'auto'
                  }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-deep)' }}>
                      <Search size={14} color="var(--text-muted)" />
                      <input
                        type="text"
                        autoFocus
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Type to search country..."
                        style={{
                          border: 'none',
                          background: 'transparent',
                          outline: 'none',
                          color: 'var(--text-primary)',
                          fontSize: 12,
                          width: '100%',
                          padding: 0
                        }}
                      />
                    </div>
                    <div>
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((c) => (
                          <div
                            key={c}
                            onClick={() => {
                              setCountry(c);
                              setIsCountryOpen(false);
                              setCountrySearch('');
                            }}
                            style={{
                              padding: '10px 14px',
                              fontSize: 12,
                              color: country === c ? '#fff' : 'var(--text-secondary)',
                              background: country === c ? 'var(--bg-elevated)' : 'transparent',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(255,255,255,0.02)'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = country === c ? 'var(--bg-elevated)' : 'transparent')}
                          >
                            {c}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                          No countries found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Payment & Summary */}
            <div style={{ padding: '28px 32px', background: 'rgba(255, 255, 255, 0.015)', display: 'flex', flexDirection: 'column' }}>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.1em', marginBottom: 16 }}>
                3. PAYMENT METHOD
              </h3>

              {/* Payment Method Stacked Selector Options */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Select Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Option 4: Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      textAlign: 'left',
                      border: paymentMethod === 'cod' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                      background: paymentMethod === 'cod' ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                      color: paymentMethod === 'cod' ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderRadius: 4
                    }}
                  >
                    <Banknote size={18} color="#4ade80" />
                    <span>Cash on Delivery</span>
                  </button>

                </div>
              </div>

              {/* DYNAMICALLY RENDERED PAYMENT CONTAINER */}
              <div style={{ minHeight: 220, marginBottom: 20 }}>
                {paymentMethod === 'card' && (
                  <div>
                    {/* 3D Black Titanium Luxury Card Simulation */}
                    <div style={{
                      background: 'linear-gradient(135deg, #18181f 0%, #0a0a0d 100%)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      borderRadius: 8,
                      padding: '16px 20px',
                      marginBottom: 16,
                      boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.2em', color: '#fff' }}>
                          DOUÈ NOIR PRIVILÈGE
                        </span>
                        <Sparkles size={14} color="#d4d4d8" />
                      </div>

                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.2em', color: '#e4e4e7', marginBottom: 16 }}>
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        <div>
                          <span>CARDHOLDER</span>
                          <div style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>{cardHolder || 'FULL NAME'}</div>
                        </div>
                        <div>
                          <span>EXPIRES</span>
                          <div style={{ color: '#fff', fontSize: 10, marginTop: 2 }}>{cardExp || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Inputs */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>CARDHOLDER NAME</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name on card"
                        style={{ width: '100%', fontSize: 12 }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>CARD NUMBER</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242..."
                          style={{ width: '100%', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>EXPIRY</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM/YY"
                          style={{ width: '100%', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>CVV</label>
                        <input
                          type="password"
                          value={cardCvc}
                          maxLength={4}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          style={{ width: '100%', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', borderRadius: 6 }}>
                    <div style={{ display: 'inline-flex', padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: 12 }}>
                      <Apple size={28} color="#fff" />
                    </div>
                    <p style={{ fontSize: 14, color: '#fff', marginBottom: 8, fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>APPLE PAY EXPRESS</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                      You will be prompted with the Apple Pay biometric authentication sheet upon confirming your acquisition.
                    </p>
                    <div style={{ display: 'inline-block', padding: '10px 20px', background: '#000', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.2)' }}>
                       PAY READY
                    </div>
                  </div>
                )}

                {paymentMethod === 'google_pay' && (
                  <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', borderRadius: 6 }}>
                    <div style={{ display: 'inline-flex', padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: 12 }}>
                      <Globe size={28} color="#60a5fa" />
                    </div>
                    <p style={{ fontSize: 14, color: '#fff', marginBottom: 8, fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>GOOGLE PAY EXPRESS</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                      You will be prompted with the Google Pay secure checkout popup upon confirming your acquisition.
                    </p>
                    <div style={{ display: 'inline-block', padding: '10px 20px', background: '#000', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.2)' }}>
                      GOOGLE PAY READY
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div style={{ padding: '30px 20px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', borderRadius: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <Banknote size={20} color="#4ade80" />
                      <p style={{ fontSize: 13, color: '#fff', fontFamily: 'var(--font-mono)', margin: 0 }}>CASH ON DELIVERY (COD)</p>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Please ensure exact cash is prepared for the courier upon arrival. Our atelier concierge will verify your order details via telephone prior to dispatch.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary Breakdown */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>Items Total ({(safeItems ?? []).length})</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{(Number(subtotal) || 0).toLocaleString()} EGP</span>
                </div>
                {Number(discount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6ee7b7', marginBottom: 6 }}>
                    <span>VIP Code Discount ({discountCode ?? ''})</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>-{(Number(discount) || 0).toLocaleString()} EGP</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>Insured Express Courier</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{(Number(shippingFee) || 0).toLocaleString()} EGP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>
                  <span>TOTAL DUE</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{(Number(Math.round(total)) || 0).toLocaleString()} EGP</span>
                </div>

                {errorMsg && (
                  <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-luxury"
                  style={{ width: '100%', padding: '16px', fontSize: 12 }}
                >
                  <Lock size={15} />
                  <span>AUTHORIZE &bull; {(Number(Math.round(total)) || 0).toLocaleString()} EGP</span>
                </button>

                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', marginTop: 10, fontFamily: 'var(--font-mono)' }}>
                  Instant Email Notifications Sent to Admin & Customer upon confirmation
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}