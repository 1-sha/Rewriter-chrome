## v1.0.1

- **Bugfix:** Better initialization at window's load. ([8e981adf](https://github.com/Peshmelba/Rewriter-chrome/commit/8e981adf276b828720f14c420baedaf8c5c6310f))
- **Bugfix:** Better js log system, disabled by default. ([8e981adf](https://github.com/Peshmelba/Rewriter-chrome/commit/8e981adf276b828720f14c420baedaf8c5c6310f))
- **Bugfix:** Better errors management in the Rule-builder. ([8e981adf](https://github.com/Peshmelba/Rewriter-chrome/commit/8e981adf276b828720f14c420baedaf8c5c6310f))

## v1.0.0

- **Feature:** Rule-builder and manager in browser-action's pop-up.
- **Feature:** Build RegExp based on user's input. So it accepts plain text but also RegExp forms as matching key.
- **Feature:** Search in page all matched keys using "match:" values, replace it with "substitute", on every "url:" found.
- **Feature:** Save rules as entities in chrome's api Storage.sync, it means that your rules will be used on every Chrome browser where you're logged in.
