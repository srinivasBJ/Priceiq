import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', sku: '', currentPrice: '', minPrice: '', maxPrice: '', costPrice: ''
  })

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => client.get('/products').then(r => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: () => client.post('/products', {
      name: form.name, sku: form.sku,
      currentPrice: Number(form.currentPrice),
      minPrice: Number(form.minPrice),
      maxPrice: Number(form.maxPrice),
      costPrice: Number(form.costPrice),
    }),
    onSuccess: () => {
      toast.success('Product created!')
      qc.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      setForm({ name: '', sku: '', currentPrice: '', minPrice: '', maxPrice: '', costPrice: '' })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const products = data?.products || []

  return (
    <div>
      <div style={{ marginBottom: '32px', paddingBottom: '20px', borderBottom: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>PRICING</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--accent-yellow)' }}>Products</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Manage your product catalog and pricing</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? '✕ CANCEL' : '+ ADD PRODUCT'}
        </button>
      </div>

      {showForm && (
        <div className="panel" style={{ marginBottom: '24px', animation: 'slideIn 0.3s ease' }}>
          <div className="panel-header"><span className="panel-title">⬡ New Product</span></div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { key: 'name', label: 'Product Name', placeholder: 'Wireless Headphones' },
                { key: 'sku', label: 'SKU', placeholder: 'SKU-1042' },
                { key: 'currentPrice', label: 'Current Price $', placeholder: '89.99' },
                { key: 'costPrice', label: 'Cost Price $', placeholder: '45.00' },
                { key: 'minPrice', label: 'Min Price $', placeholder: '70.00' },
                { key: 'maxPrice', label: 'Max Price $', placeholder: '120.00' },
              ].map(f => (
                <div key={f.key} className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{f.label}</label>
                  <input
                    className="form-control"
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => createMutation.mutate()} className="btn btn-primary" style={{ marginTop: '16px' }}>
              {createMutation.isPending ? 'SAVING...' : '→ CREATE PRODUCT'}
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">⬡ Product Catalog</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {products.length} products
          </span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>LOADING...</div>
          ) : products.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px' }}>No products yet</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add your first product to get started</div>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Price</th>
                  <th>Cost</th>
                  <th>Margin</th>
                  <th>Min / Max</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => {
                  const margin = ((p.currentPrice - p.costPrice) / p.currentPrice * 100).toFixed(1)
                  return (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-main)', fontWeight: '500' }}>{p.name}</td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{p.sku}</td>
                      <td style={{ fontFamily: 'var(--mono)', color: 'var(--accent-yellow)' }}>${p.currentPrice}</td>
                      <td style={{ fontFamily: 'var(--mono)' }}>${p.costPrice}</td>
                      <td>
                        <span className={`badge ${Number(margin) >= 30 ? 'badge-green' : Number(margin) >= 15 ? 'badge-yellow' : 'badge-red'}`}>
                          {margin}%
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ${p.minPrice} / ${p.maxPrice}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}