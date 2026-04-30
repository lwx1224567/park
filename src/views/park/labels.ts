// Unified Labels API
export type LabelKind = 'cabinet' | 'device' | 'environment' | 'network' | 'security';

export class Labels {
  private app: any;
  private currentName: string | null = null;

  constructor(app: any) {
    this.app = app;
  }

  private card(title: string, bodyRows: Array<[string, string]>, gradient: string) {
    const el = document.createElement('div');
    el.style.width = '200px';
    el.style.height = '120px';
    el.style.background = '#0f172a';
    el.style.color = '#e5e7eb';
    el.style.border = '1px solid #334155';
    el.style.borderRadius = '10px';
    el.style.boxShadow = '0 10px 25px rgba(0,0,0,0.35)';
    el.style.boxSizing = 'border-box';
    el.style.overflow = 'hidden';
    el.style.display = 'flex';
    el.style.flexDirection = 'column';

    const rows = bodyRows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:12px;"><span>${k}</span><span>${v}</span></div>`).join('');

    el.innerHTML = `
      <div style="height:32px;background:${gradient};display:flex;align-items:center;padding:0 10px;color:#fff;">
        <div style="font-weight:700;font-size:13px;">${title}</div>
      </div>
      <div style="flex:1;padding:10px 12px;display:flex;flex-direction:column;gap:6px;">${rows}</div>
    `;
    return el;
  }

  show(name: string, kind: LabelKind, data: any = {}, offsetY = 0.8) {
    this.hide();
    let el: HTMLElement;
    switch (kind) {
      case 'cabinet':
        el = this.card(`🏢 ${name}`, [
          ['温度', `${data.temperature ?? 26}°C`],
          ['湿度', `${data.humidity ?? 45}%`],
          ['状态', `${data.status ?? '正常运行'}`],
        ], 'linear-gradient(90deg,#2563eb 0%,#22d3ee 100%)');
        break;
      case 'device':
        el = this.card(`⚡ ${name}`, [
          ['类型', `${data.type ?? 'UPS'}`],
          ['功率', `${data.power ?? '5KW'}`],
          ['位置', `${data.location ?? '机房A'}`],
        ], 'linear-gradient(90deg,#16a34a 0%,#22c55e 100%)');
        break;
      case 'environment':
        el = this.card(`🌡️ ${name}`, [
          ['温度', `${data.temperature ?? 24}°C`],
          ['湿度', `${data.humidity ?? 50}%`],
          ['CO₂', `${data.co2 ?? 400}ppm`],
        ], 'linear-gradient(90deg,#06b6d4 0%,#60a5fa 100%)');
        break;
      case 'network':
        el = this.card(`🌐 ${name}`, [
          ['IP', `${data.ip ?? '192.168.1.100'}`],
          ['端口', `${data.port ?? 80}`],
          ['运行时间', `${data.uptime ?? '99天'}`],
        ], 'linear-gradient(90deg,#06b6d4 0%,#64748b 100%)');
        break;
      case 'security':
        el = this.card(`🔒 ${name}`, [
          ['摄像头', `${data.camera ?? 8} 个`],
          ['门禁', `${data.access ?? '正常'}`],
          ['检查', `${data.lastCheck ?? '2分钟前'}`],
        ], 'linear-gradient(90deg,#ef4444 0%,#f97316 100%)');
        break;
    }
    this.app.addLabelAboveObject(name, el, offsetY);
    this.currentName = name;
  }

  hide() {
    if (this.currentName) {
      this.app.removeLabel(this.currentName);
      this.currentName = null;
    }
  }

  isShowing(name: string) {
    return this.currentName === name;
  }

  printAll() {
    return Array.from(this.app.objects.keys());
  }
}


