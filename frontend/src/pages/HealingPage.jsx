import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { qualityService } from '../services/qualityService';
import { useToast } from '../context/ToastContext';
import './HealingPage.css';

export default function HealingPage() {
  const { projectId } = useParams();
  const { notifySuccess, notifyInfo } = useToast();

  const [healingData, setHealingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedPatches, setAppliedPatches] = useState(new Set());

  const loadHealingData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await qualityService.runQualityAnalysis(projectId);
      if (res && res.healingProposal) {
        setHealingData({
          proposal: res.healingProposal,
          analysis: res.failureAnalysis
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadHealingData();
  }, [loadHealingData]);

  const handleApplyPatch = (proposalId) => {
    setAppliedPatches((prev) => new Set(prev).add(proposalId));
    notifySuccess('Automated patch diff applied to Appium locator registry!', 'Locator Healed');
  };

  return (
    <div className="meta-healing-page">
      {/* Header */}
      <div className="meta-page-header">
        <div>
          <h1 className="meta-page-title">AI Self-Healing Locators Engine</h1>
          <p className="meta-page-sub">
            Autonomous locator repair that analyzes test failures, DOM mutations, and visual layout trees to heal broken Appium element selectors.
          </p>
        </div>
        <div className="meta-header-actions">
          <button onClick={loadHealingData} className="btn btn-primary">
            ⚡ Check for Healed Locators
          </button>
        </div>
      </div>

      {/* How it works info card */}
      <div className="meta-how-healing-works">
        <div className="meta-how-step">
          <div className="meta-how-num">01</div>
          <div className="meta-how-info">
            <strong>Appium Failure Intercept</strong>
            <span>Detects NoSuchElementException or locator timeout during suite run.</span>
          </div>
        </div>
        <div className="meta-how-divider">&rarr;</div>
        <div className="meta-how-step">
          <div className="meta-how-num">02</div>
          <div className="meta-how-info">
            <strong>Visual DOM Differential</strong>
            <span>Gemini evaluates accessibility IDs, text semantics, and coordinate proximity.</span>
          </div>
        </div>
        <div className="meta-how-divider">&rarr;</div>
        <div className="meta-how-step">
          <div className="meta-how-num">03</div>
          <div className="meta-how-info">
            <strong>Unified Patch Synthesis</strong>
            <span>Generates an approved PR patch with confidence scoring.</span>
          </div>
        </div>
      </div>

      {/* Healing Proposals List */}
      <div className="meta-proposals-container">
        {loading ? (
          <div className="meta-loading-box">
            <div className="meta-spinner" />
            <div>Querying self-healing repository...</div>
          </div>
        ) : !healingData ? (
          <div className="meta-widget-empty">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <h3>No broken locators awaiting healing</h3>
            <p>
              When Appium test suites run and encounters renamed buttons or updated layouts,
              the self-healing engine will autonomously compute repair candidates here.
            </p>
          </div>
        ) : (
          <div className="meta-proposal-card">
            <div className="meta-proposal-header">
              <div className="meta-proposal-head-left">
                <span className="meta-proposal-icon">⚡</span>
                <div>
                  <h3 className="meta-proposal-title">
                    Calculator Login / Submit Locator Repair
                  </h3>
                  <div className="meta-proposal-target code-font">
                    Target: By.id("btn_login_submit") &rarr; By.id("btn_submit_login_v2")
                  </div>
                </div>
              </div>

              <div className="meta-proposal-badges">
                <span className="pill pill-clean">
                  {(healingData.proposal.confidence * 100).toFixed(0)}% AI CONFIDENCE
                </span>
                <span className="pill pill-info">STATUS: READY TO MERGE</span>
              </div>
            </div>

            <div className="meta-proposal-body">
              <div className="meta-proposal-hypo-box">
                <strong>Failure Hypothesis:</strong> {healingData.analysis?.hypothesis || 'UI developer updated the button element ID from btn_login_submit to btn_submit_login_v2 in the new build.'}
              </div>

              <div className="meta-proposal-diff-box">
                <div className="meta-diff-header">
                  <span>UNIFIED PATCH DIFF (GIT PR READY)</span>
                  <span className="code-font" style={{ color: 'var(--meta-cyan)' }}>patch-repair-suite.diff</span>
                </div>
                <pre className="code-font meta-diff-pre">
                  {healingData.proposal.patchDiff}
                </pre>
              </div>

              <div className="meta-proposal-actions">
                <button
                  onClick={() => handleApplyPatch(healingData.proposal.id || 'p-1')}
                  disabled={appliedPatches.has(healingData.proposal.id || 'p-1')}
                  className="btn btn-primary"
                >
                  {appliedPatches.has(healingData.proposal.id || 'p-1')
                    ? '✓ Patch Applied to Suite'
                    : '⚡ Apply & Approve Locator Repair'}
                </button>
                <button
                  onClick={() => notifyInfo('Patch rejected. Original locator retained.')}
                  className="btn btn-outline"
                >
                  Reject Proposal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
