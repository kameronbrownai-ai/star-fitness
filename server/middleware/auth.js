import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Verifies the Supabase JWT sent in the Authorization header.
// On success, attaches req.user = { id, email, ... }
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = user
  next()
}

// Must run after requireAuth.
// Checks the subscriptions table for an active Pro plan.
export async function requireSubscription(req, res, next) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, plan')
    .eq('user_id', req.user.id)
    .single()

  if (!sub || sub.status !== 'active') {
    return res.status(403).json({
      error: 'Pro subscription required',
      code: 'SUBSCRIPTION_REQUIRED',
    })
  }

  req.subscription = sub
  next()
}
