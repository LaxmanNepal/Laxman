# Architecture

```text
Voice / Dashboard / Tasker / Events
                |
         Command Gateway
                |
   Auth -> Validate -> Policy -> Audit
                |
          Commander
                |
      +---------+---------+
      |         |         |
    Phone     GitHub    Research ...
      |         |         |
   Android    GitHub     Web/AI
                |
          Approval Gate
```

## V1
Gateway, agent registry, audit, permissions.

## V2
Voice is only an input channel. Voice text is normalized into the same command envelope used by every other client.

## V3
Tasker executes only named allowlisted tasks. Arbitrary shell is never exposed through the HTTP API.

## V4
Agents are specialists. Commander routes; specialists execute only declared capabilities.

## V5
Work, creator and monitoring workflows are declarative and bounded.

## V6
GitHub automation uses inspect -> branch -> change -> CI -> PR -> human approval. Main remains protected by policy.

## V7
Cloud AI provides reasoning; local Android/Termux provides execution. Provider adapters can be added without changing the security layer.

## V8
External events become normalized events and are evaluated against declarative rules.

## V9
Multi-agent work follows planner -> specialist -> verifier. The verifier cannot silently elevate permissions.

## V10
Autonomy is bounded by maximum risk, step count, runtime, retries, and hard blocks. Security policy is not self-modifiable by agents.
