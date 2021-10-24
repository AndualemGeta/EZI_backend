import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
// Translate
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, TranslateModule],
  exports: [CommonModule, TranslateModule],
})
export class LanguageModule {}
